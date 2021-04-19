import React, { Component } from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getExpense } from '../../../redux/actions/group/expenseGroupAction';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';
import BalanceList from './BalanceList';

class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // get all users from backend
  componentDidMount() {
    // const { group } = this.state;
    // console.log(group);
    // let timezone = cookie.load('timezone')? cookie.load('timezone'):'';
    const data = {
      groupId : this.props.match.params.group,
      userId : this.props.user._id,
    }
    this.props.getExpense(data);
  }


  render() {
    if (!this.props || !this.props.user || !this.props.user._id) {
      return <Redirect to="/landing" />;
    }

    return (
      <div className="container-fluid">
        <h3>
          Group
          {' '}
          {this.props.group.name}
        </h3>
        { this.props.message !== '' && <div className="alert alert-info">{this.props.message}</div>}
        <AddExpense />
        <br />
        <br />
        <div class = "row">
          <div class="col-md-8">
            <ExpenseList />
          </div>
          <div class="col-md-4">
            <BalanceList />
          </div>
        </div>
      </div>
    );
  }
}

Expense.propTypes = {
  getExpense: PropTypes.func.isRequired,
  expenses: PropTypes.object.isRequired,
  balances: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  balances: state.groupExpense.balances,
  expenses: state.groupExpense.expenses,
  group: state.groupExpense.group,
  message: state.groupExpense.message,
  user: state.login.user,
});

export default connect(mapStateToProps, { getExpense })(Expense);
