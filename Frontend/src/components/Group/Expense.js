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
      email: localStorage.getItem('user'),
      expenses: [],
      balances: [],
      description: '',
      amount: -1,
      message: '',
      authorized: false,
    };
  }

  // get all users from backend
  componentDidMount() {
    const { group } = this.state;
    // console.log(group);
    let timezone = localStorage.getItem('timezone')? localStorage.getItem('timezone'):'';
    Axios.get(`/group/expense/${group}`, {
      params: {
        timezone: timezone,
        user: localStorage.getItem('user'),
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
      email: this.state.email,
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

  render() {
    if (!localStorage.getItem('user')) {
      return <Redirect to="/landing" />;
    }
    const currency = localStorage.getItem('currency');
    let expenses = this.state.expenses.map((expense) => {
      return(
          <tr>
            <td>{expense.date}</td>
            <td>{expense.description}</td>
            <td>{expense['user.name']} paid</td>
            <td>{numeral(expense.amount).format('0,0.00')} {currency}</td>
          </tr>
      )      
    }); 
    
    let balances = this.state.balances.map((balance) => {
      if (balance.total > 0){
        return (
          <li class="list-group-item">{balance.U1.name} owes {balance.U2.name} {numeral(balance.total).format('0,0.00')} {currency}</li>
        )
      }
      else if (balance.total < 0) {
        return (
          <li class="list-group-item">{balance.U2.name} owes {balance.U1.name} {numeral(-balance.total).format('0,0.00')} {currency}</li>
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
