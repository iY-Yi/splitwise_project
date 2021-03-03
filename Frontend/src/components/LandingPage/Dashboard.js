import React, { Component } from 'react';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';

class Dashboard extends Component {
  render() {
    if (!cookie.load('user')) {
      return <Redirect to="/landing" />;
    }
    return (

      <div className="container">
        <h3>Dashboard</h3>
      </div>
    );
  }
}

export default Dashboard;