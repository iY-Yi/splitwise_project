import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
import Signup from './User/Signup';
import Login from './User/Login';
import Profile from './User/Profile';
import NewGroup from './Group/NewGroup';
import AllGroup from './Group/MyGroups/AllGroup';
import Expense from './Group/GroupExpense/Expense';
import Navigationbar from './LandingPage/Navbar';
import Landing from './LandingPage/Landing';
import Dashboard from './Dashboard/Dashboard';
import Activity from './Dashboard/Activity';
import {Redirect} from 'react-router';

// Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}
        <Route exact path="/"><Redirect to="/landing" /></Route>
        <Route path="/" component={Navigationbar} />
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
