import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
import Signup from './User/Signup';
import Login from './User/Login';
import Profile from './User/Profile';
import NewGroup from './Group/NewGroup';
import AllGroup from './Group/AllGroup';
import Expense from './Group/Expense';
import Navbar from './LandingPage/Navbar';
import Landing from './LandingPage/Landing';
import Dashboard from './LandingPage/Dashboard';
import Activity from './Dashboard/Activity';

// Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}
        <Route path="/" component={Navbar} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/user/signup" component={Signup} />
        <Route path="/user/login" component={Login} />
        <Route path="/user/profile" component={Profile} />
        <Route path="/group/new" component={NewGroup} />
        <Route path="/group/all" component={AllGroup} />
        <Route path="/group/expense/:group" component={Expense} />
        <Route path="/landing" component={Landing} />
        <Route path="/activity" component={Activity} />
      </div>
    );
  }
}
// Export The Main Component
export default Main;
