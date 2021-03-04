import Axios from 'axios';
import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.match.params.group,
      email: cookie.load('user'),
      expenses: [],
      description: '',
      amount: -1,
      message: '',
    };
  }

  // get all users from backend
  componentDidMount() {
    const { group } = this.state;
    console.log(group);
    Axios.get(`/group/expense/${group}`, {
    })
      .then((response) => {
        // update the state with the response data
        console.log(response.data.expenses);
        this.setState({
          expenses: this.state.expenses.concat(response.data.expenses),
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
        message: "The expense is added",
      });
    })
    .catch((err) => {
      console.log(err);
    })
  }

  render() {
    let expenses = this.state.expenses.map((expense) => {
      return(
          <tr>
            <td>{expense.date}</td>
            <td>{expense.description}</td>
            <td>{expense.amount}</td>
            <td>{expense.user.name} paid</td>
          </tr>
      )      
    });     
    return (
      <div className="container-fluid">
        <h3>
          Group
          {' '}
          {this.state.group}
        </h3>
        { this.state.message !== '' && <div className="alert alert-info">{this.state.message}</div>}

        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#addExpenseModal">
          Add an expense
        </button>
        <br />
        <br />
        <h5>Expenses</h5>
        <table class="table">
          <tbody>
            {expenses}
          </tbody>
        </table> 
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
