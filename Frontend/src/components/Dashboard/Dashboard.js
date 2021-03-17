import React, { Component } from 'react';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import Axios from 'axios';
import numeral from 'numeral';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owes: [],
      owed: [],
      details: [],
      userSelected: '',
      user: '',
      message: '',
    };
  }

  // get all balances
  componentDidMount() {
    this.setState({ user: cookie.load('user') });
    Axios.get('/dashboard', {
      params: {
        user: cookie.load('user'),
      },
    })
      .then((response) => {
        // update the state with the response data
        // console.log(response.data.balances);
        this.setState({
          owes: response.data.owes,
          owed: response.data.owed,
          details: response.data.details,
        });
      });
  }

  selectRow = (e) => {
    this.setState({ userSelected: e.target.value, message: '' });
  }

  settleUp = () => {
    if (this.state.userSelected === '') {
      this.setState({ message: 'No balance selected.' });      
    }
    else {
      const data = {
        user: cookie.load('user'),
        user2: this.state.userSelected,
      }
      Axios.post('/settle', data)
      .then((response) => {
        this.setState({ message: 'Balance is settled.' });
        this.componentDidMount();
      });
    }
  }

  render() {
    if (!cookie.load('user')) {
      return <Redirect to="/landing" />;
    }
    const currency = cookie.load('currency');
    const owesList = this.state.owes
      .map((record) => (
        <tr>
          <td><input type="radio" class="form-check-input" name="selectRow" value={record.email} onClick={this.selectRow} /></td>
          <td>{record.name}</td>
          <td>{numeral(record.balance).format('0,0.00')} {currency}</td>
        </tr>
      ));

    const owedList = this.state.owed
      .map((record) => (
        <tr>
          <td><input type="radio" class="form-check-input" name="selectRow" value={record.email} onClick={this.selectRow} /></td>
          <td>{record.name}</td>
          <td>{numeral(record.balance).format('0,0.00')} {currency}</td>
        </tr>
      ));

    const detailsList = this.state.details.map((d) => {
      console.log(d);
      if (d.total < 0) {
        return(<li class="list-group-item">{d.user2===this.state.user? 'You': d['U2.name']} owes {d.user1===this.state.user? 'you': d['U1.name']} {numeral(-d.total).format('0,0.00')} {currency} in group {d.group}</li>);
      }
      else {
        return(<li class="list-group-item">{d.user1===this.state.user? 'You': d['U1.name']} owes {d.user2===this.state.user? 'you': d['U2.name']} {numeral(d.total).format('0,0.00')} {currency} in group {d.group}</li>);
      }
    });
    return (
      <div className="container">
        <h3>Dashboard</h3>
        <br />
        { this.state.message !== '' && <div className="alert alert-info">{this.state.message}</div>}
        <button type="button" class="btn btn-info" onClick={this.settleUp}>Settle Up</button>
        <br />
        <br />
        <div className="row">
          <div className="col-md-6">
            <h5>You Owe</h5>
            { this.state.owes.length === 0 && <div class="alert alert-info">You don't owes.</div>}
            <table className="table table-hover">
              <tbody>
                {owesList}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <h5>You are Owed</h5>
            { this.state.owed.length === 0 && <div class="alert alert-info">You are not owned.</div>}
            <table className="table table-hover">
              <tbody>
                {owedList}
              </tbody>
            </table>
          </div>
        </div>
        <br />
        <h5>Details</h5>
        { this.state.details.length === 0 && <div class="alert alert-info">You don't have group balance.</div>}
        <ul class="list-group list-group-flush">
          {detailsList}
        </ul>
      </div>
    );
  }
}

export default Dashboard;
