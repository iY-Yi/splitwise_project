import React, { Component } from 'react';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import Axios from 'axios';
import numeral from 'numeral';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDashboard, settle } from '../../redux/actions/dashboardAction';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSelected: '',
      message: '',
    };
  }

  // get all balances
  componentDidMount() {
    const data = {
      user: this.props.user._id,
      token: this.props.token,
    }
    this.props.getDashboard(data);
  }

  selectRow = (e) => {
    this.setState({ userSelected: e.target.value });
  }
  
  settleUp = () => {
    if (this.state.userSelected === '') {
      alert('No balance selected.');  
    }
    else {
      const data = {
        user: this.props.user._id,
        user2: this.state.userSelected,
        token: this.props.token,
      }
      this.props.settle(data);
      this.setState({ userSelected: '' });
      this.componentDidMount();
    }
  }

  render() {
    if (!this.props || !this.props.user || !this.props.user._id) {
      return <Redirect to="/landing" />;
    } 
    const currency = this.props.user.currency;
    const currentUser = this.props.user._id;

    const owesList = this.props.owes
      .map((record) => (
        <tr>
          <td><input type="radio" class="form-check-input" name="selectRow" value={record.userId} onClick={this.selectRow} /></td>
          <td>{record.name}</td>
          <td>{numeral(record.balance).format('0,0.00')} {currency}</td>
        </tr>
      ));

    const owedList = this.props.owed
      .map((record) => (
        <tr>
          <td><input type="radio" class="form-check-input" name="selectRow" value={record.userId} onClick={this.selectRow} /></td>
          <td>{record.name}</td>
          <td>{numeral(record.balance).format('0,0.00')} {currency}</td>
        </tr>
      ));

    const detailsList = this.props.details.map((d) => {
      console.log(d);
      if (d.total < 0) {
        return(<li class="list-group-item">{d.user2===currentUser? 'You': d.U2[0].name} owes {d.user1===currentUser? 'you': d.U1[0].name} {numeral(-d.total).format('0,0.00')} {currency} in group {d.groupDetails[0].name}</li>);
      }
      else {
        return(<li class="list-group-item">{d.user1===currentUser? 'You': d.U1[0].name} owes {d.user2===currentUser? 'you': d.U2[0].name} {numeral(d.total).format('0,0.00')} {currency} in group {d.groupDetails[0].name}</li>);
      }
    });
    return (
      <div className="container">
        <h3>Dashboard</h3>
        <br />
        { this.props.message !== '' && <div className="alert alert-info">{this.state.message}</div>}
        <button type="button" class="btn btn-info" onClick={this.settleUp}>Settle Up</button>
        <br />
        <br />
        <div className="row">
          <div className="col-md-6">
            <h5>You Owe</h5>
            { this.props.owes.length === 0 && <div class="alert alert-info">You don't owes.</div>}
            <table className="table table-hover">
              <tbody>
                {owesList}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <h5>You are Owed</h5>
            { this.props.owed.length === 0 && <div class="alert alert-info">You are not owned.</div>}
            <table className="table table-hover">
              <tbody>
                {owedList}
              </tbody>
            </table>
          </div>
        </div>
        <br />
        <h5>Details</h5>
        { this.props.details.length === 0 && <div class="alert alert-info">You don't have group balance.</div>}
        <ul class="list-group list-group-flush">
          {detailsList}
        </ul>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getDashboard: PropTypes.func.isRequired,
  settle: PropTypes.func.isRequired,
  owes: PropTypes.object.isRequired,
  owed: PropTypes.object.isRequired,
  details: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  token: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  owes: state.dashboard.owes,
  owed: state.dashboard.owed,
  details: state.dashboard.details,
  message: state.dashboard.message,
  user: state.login.user,
  token: state.login.token,
});

export default connect(mapStateToProps, { getDashboard, settle })(Dashboard);
