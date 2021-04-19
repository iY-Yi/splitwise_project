import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { userLogout } from '../../redux/actions/user/loginAction';
import { connect } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import PropTypes from 'prop-types';

// create the Navbar Component
class Navigationbar extends Component {
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
    if (this.props.user && this.props.user._id) {
      // console.log('Able to read cookie');
      navLogin = (
        <Navbar bg="light" variant="light">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
          <Nav.Link as={NavLink} to="/group/all">Groups</Nav.Link>
          <Nav.Link as={NavLink} to="/activity">Activity</Nav.Link>
          <Nav.Link as={NavLink} to="/user/profile">Profile</Nav.Link>
          <Nav.Link as={NavLink} to="/landing" onClick={this.handleLogout}>Logout</Nav.Link>
        </Nav>
        </Navbar>

      );
    } else {
      // Else display login button
      // console.log('Not Able to read cookie');
      navLogin = (
        <Navbar bg="light" variant="light">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/user/signup">Sign Up</Nav.Link>
          <Nav.Link as={NavLink} to="/user/login">Log In</Nav.Link>
        </Nav>
        </Navbar>
      );
    }

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

Navigationbar.propTypes = {
  userLogout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.login.user,
});

const mapDispatchToProps = dispatch => {
  return {
    userLogout: ()=> dispatch(userLogout())
  }
}

export default connect(mapStateToProps, {userLogout})(Navigationbar);
