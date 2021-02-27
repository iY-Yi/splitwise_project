import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Signup from './User/Signup';
import Login from './User/Login';
import Profile from './User/Profile';
import NewGroup from './Group/NewGroup';
import Navbar from './LandingPage/Navbar';
import Landing from './LandingPage/Landing';

// Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}
        <Route path="/" component={Navbar} />
        <Route path="/landing" component={Landing} />
        <Route path="/user/signup" component={Signup} />
        <Route path="/user/login" component={Login} />
        <Route path="/user/profile" component={Profile} />
        <Route path="/group/new" component={NewGroup} />
      </div>
    );
  }
}
// Export The Main Component
export default Main;
