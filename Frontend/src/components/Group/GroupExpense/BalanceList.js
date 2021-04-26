import React, { Component } from 'react';
import numeral from 'numeral';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class BalanceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { currency } = this.props.user;
    console.log(this.props.balances);
    const balances = this.props.balances.map((balance) => {
      if (balance.total > 0) {
        return (
          <li className="list-group-item">
            {balance.U1[0].name}
            {' '}
            owes
            {' '}
            {balance.U2[0].name}
            {' '}
            {numeral(balance.total).format('0,0.00')}
            {' '}
            {currency}
          </li>
        );
      }
      if (balance.total < 0) {
        return (
          <li className="list-group-item">
            {balance.U2[0].name}
            {' '}
            owes
            {' '}
            {balance.U1[0].name}
            {' '}
            {numeral(-balance.total).format('0,0.00')}
            {' '}
            {currency}
          </li>
        );
      }
    });

    return (
      <>
        <h5>Group Balances</h5>
        { this.props.balances.length === 0 && <div className="alert alert-info">No open balances.</div>}
        <ul className="list-group list-group-flush">
          {balances}
        </ul>
      </>
    );
  }
}

BalanceList.propTypes = {
  balances: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  balances: state.groupExpense.balances,
  user: state.login.user,
});

export default connect(mapStateToProps, { })(BalanceList);
