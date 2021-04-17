import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { userLogout } from '../../js/actions/loginAction';
import { connect } from 'react-redux';

// create the Navbar Component
class Navbar extends Component {
  constructor(props){
      super(props);
      this.handleLogout = this.handleLogout.bind(this);
  }
  //handle logout to destroy the cookie

  handleLogout = () => {
      cookie.remove('user', { path: '/' })
      cookie.remove('name', { path: '/' })
      cookie.remove('currency', { path: '/' })
      cookie.remove('timezone', { path: '/' })
      cookie.remove('id', { path: '/' })
      localStorage.clear();
      this.props.userLogout();
  }

  render() {
    // if Cookie is set render Logout Button
    let navLogin = null;
    if (cookie.load('user')) {
      // console.log('Able to read cookie');
      navLogin = (
          <ul className="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/dashboard">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/group/all">Groups</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/activity">Activity</a>
            </li>                    
            <li class="nav-item">
              <a class="nav-link" href="/user/profile">Profile</a>
            </li>          
            <li class="nav-item">
              <a class="nav-link" href="/landing" onClick={this.handleLogout}>Logout</a>
            </li>
          </ul>
      );
    } else {
      // Else display login button
      // console.log('Not Able to read cookie');
      navLogin = (
          <ul className="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/user/signup">Sign Up</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/user/login">Log in</a>
            </li>          
          </ul>
      );
    }
    // let redirectVar = null;
    // if (cookie.load('user')) {
    //   redirectVar = <Redirect to="/dashboard" />;
    // }
    // if (!cookie.load('user')) {
    //   redirectVar = <Redirect to="/landing" />;
    // }
    return (
      <div>
        {/* {redirectVar} */}
        <nav className="navbar navbar-inverse navbar-expand-sm bg-light navbar-light">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="/landing">Splitwise</a>
            </div>
            {navLogin}
          </div>
        </nav>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userLogout: ()=> dispatch(userLogout())
  }
}

export default connect(null, mapDispatchToProps)(Navbar);
