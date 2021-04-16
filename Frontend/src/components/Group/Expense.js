import Axios from 'axios';
import React, { Component } from 'react';
import cookie from 'react-cookies';
import numeral from 'numeral';
import { Redirect } from 'react-router';

class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.match.params.group,
      payor: cookie.load('id'),
      expenses: [],
      balances: [],
      description: '',
      amount: -1,
      message: '',
      authorized: false,  // TO DO: change to false
      expenseIdx: 0,
      expenseDisplay: {},
      expenseSelect: false,
      addComment: '',
    };
  }

  // get all users from backend
  componentDidMount() {
    const { group } = this.state;
    // console.log(group);
    let timezone = cookie.load('timezone')? cookie.load('timezone'):'';
    Axios.get(`/group/expense/${group}`, {
      params: {
        timezone: timezone,
        user: cookie.load('id'),
      },
    })
      .then((response) => {
        // update the state with the response data
        // console.log(response.data.balances);
        this.setState({
          expenses: response.data.expenses,
          balances: response.data.balances,
          authorized: true,
        });
        // console.log(this.state.balances);
      })
      .catch((err) => {
        this.setState({
          message: 'Unauthorized!',
        });        
      });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  addExpense = () => {
    const data = {
      group: this.state.group,
      description: this.state.description,
      amount: this.state.amount,
      payor: this.state.payor,
    }
    Axios.post('/group/expense/add', data)
    .then ((response) => {
      this.setState({
        message: "Add expense successfully.",
      });
      this.componentDidMount();
    })
    .catch((err) => {
      this.setState({
        message: 'Add expense failed!',
      });
      // console.log(err);
    })
  }

  addComment = () => {
    const data = {
      expense: this.state.expenseDisplay._id,
      comment: this.state.addComment,
      userId: cookie.load('id'),
      userName: cookie.load('name'),
    }
    Axios.post('/group/expense/addComment', data)
    .then ((response) => {
      const updatedExpense = response.data;
      let expenses = [...this.state.expenses];
      // const index = expenses.findIndex(el => el._id === updatedExpense._id);
      // console.log(index);
      expenses[this.state.expenseIdx] = {...updatedExpense};
      this.setState({
        message: "Add comment successfully.",
        expenses: expenses,
        addComment: '',
        expenseDisplay: response.data,
      });
      console.log(this.state.expenses);
      // this.componentDidMount();
    })
    .catch((err) => {
      this.setState({
        message: 'Add comment failed!',
      });
      // console.log(err);
    })
  }

  deleteComment = (e) => {
    const data = {
      expenseId: this.state.expenseDisplay._id,
      commentId: e.target.value,
    }
    if (confirm("Please confirm to delete the note!")) {
      Axios.post('/group/expense/deleteComment', data)
      .then ((response) => {
        const updatedExpense = response.data;
        let expenses = [...this.state.expenses];
        // const index = expenses.findIndex(el => el._id === updatedExpense._id);
        // console.log(index);
        expenses[this.state.expenseIdx] = {...updatedExpense};
        this.setState({
          message: "Delete comment successfully.",
          expenses: expenses,
          expenseDisplay: response.data,
        });
        // console.log(this.state.expenses);
        // this.componentDidMount();
      })
      .catch((err) => {
        this.setState({
          message: 'Delete comment failed!',
        });
        // console.log(err);
      })
    }
  }

  displayNotes = (e) => {
    // console.log(e.target.value);
    const idx = e.target.value;
    this.setState({
      expenseIdx: idx,
      expenseDisplay: this.state.expenses[idx],
      expenseSelect: true,
      // notesDisplay: [...this.state.expenses.notes],
    });
  }

  render() {
    if (!cookie.load('id')) {
      return <Redirect to="/landing" />;
    }
    const currency = cookie.load('currency');
    let expenses = this.state.expenses.map((expense, index) => {
      return(
          <tr>
            <td>{expense.date}</td>
            <td>{expense.description}</td>
            <td>{expense.payor.name} paid</td>
            <td>{numeral(expense.amount).format('0,0.00')} {currency}</td>
            {/* <td><a href={"/group/expense/notes/"+ expense._id}><button type="button" class="btn btn-secondary btn-sm" value={expense._id}>Notes</button></a></td> */}
            <td><button class="btn btn-secondary btn-sm" data-toggle="collapse" data-target="#notes" value={index} onClick={(e)=>this.displayNotes(e)}>Display Notes</button></td>
          </tr>
      )      
    }); 
    
    let balances = this.state.balances.map((balance) => {
      if (balance.total > 0){
        return (
          <li class="list-group-item">{balance.U1[0].name} owes {balance.U2[0].name} {numeral(balance.total).format('0,0.00')} {currency}</li>
        )
      }
      else if (balance.total < 0) {
        return (
          <li class="list-group-item">{balance.U2[0].name} owes {balance.U1[0].name} {numeral(-balance.total).format('0,0.00')} {currency}</li>
        )        
      }
    });

    return (
      <div className="container-fluid">
        <h3>
          Group
          {' '}
          {this.state.group}
        </h3>
        { this.state.message !== '' && <div className="alert alert-info">{this.state.message}</div>}

        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#addExpenseModal" disabled={!this.state.authorized}>
          Add an expense
        </button>
        <br />
        <br />
        <div class = "row">
          <div class="col-md-8">
            <h5>Expenses</h5>
            { this.state.expenses.length === 0 && <div class="alert alert-info">No expenses.</div>}
            <table class="table">
              <tbody>
                {expenses}
              </tbody>
            </table>

            {/* collapse to display and add comments */}
            <div id="notes" class="collapse">
              {this.state.expenseSelect ? (
                <div>
                  <div class="card">
                    <div class="card-header">{this.state.expenseDisplay.description} {numeral(this.state.expenseDisplay.amount).format('0,0.00')} {currency}</div>
                    {this.state.expenseDisplay.notes.map(note => 
                      <div class="card-body">
                        <p>{note.comment}</p>
                        <p><i>{note.userName} added on {note.date}</i></p>
                        {note.userId === cookie.load('id')? (<button class="btn btn-secondary btn-sm" value={note._id} onClick={(e)=>this.deleteComment(e)}>Delete</button>):(<div />)}
                        </div>)}
                  </div>
                  <form>
                    <textarea class="form-control" rows="3" id="comment" name="addComment" onChange={this.handleChange} placeholder="Add a comment.."/>
                    <button type="button" className="btn btn-primary" onClick={this.addComment}>Add</button>
                  </form>
                </div>
              ) : (<div />)
              }
            </div>

          </div>
          <div class="col-md-4">
            <h5>Group Balances</h5>
            { this.state.balances.length === 0 && <div class="alert alert-info">No open balances.</div>}
            <ul class="list-group list-group-flush">
              {balances}
            </ul>
          </div>
        </div> 
        {/* Modal to add expense */}
        <div className="modal" id="addExpenseModal">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Add an expense</h5>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>

              <div className="modal-body">
                <form>
                  <label for="group">With you and: </label>
                  <input className="form-control" type="text" id="group" name="group" value={this.state.group} disabled />
                  <label>Description</label>
                  <input className="form-control" type="text" id="description" name="description" onChange={this.handleChange} />
                  <label>Amount</label>
                  <input className="form-control" type="number" id="amount" name="amount" onChange={this.handleChange} />
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={this.addExpense} data-dismiss="modal">Save</button>
                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Expense;
