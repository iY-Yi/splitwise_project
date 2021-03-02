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
      this.props.userLogout();
  }

  render() {
    // if Cookie is set render Logout Button
    let navLogin = null;
    if (cookie.load('user')) {
      // console.log('Able to read cookie');
      navLogin = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="/" onClick={this.handleLogout}>
              <span className="glyphicon glyphicon-user" />
              Logout
            </Link>
          </li>
        </ul>
      );
    } else {
      // Else display login button
      // console.log('Not Able to read cookie');
      navLogin = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="/user/signup">
              <span className="glyphicon glyphicon-log-in" />
              {' '}
              Sign Up
            </Link>
          </li>
          <li>
            <Link to="/user/login">
              <span className="glyphicon glyphicon-log-in" />
              {' '}
              Login
            </Link>
          </li>
        </ul>
      );
    }
    let redirectVar = null;
    if (cookie.load('user')) {
      redirectVar = <Redirect to="/dashboard" />;
    }
    if (!cookie.load('user')) {
      redirectVar = <Redirect to="/landing" />;
    }
    return (
      <div>
        {redirectVar}
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand">Splitwise</a>
            </div>
            {/* <ul class="nav navbar-nav">
            <li class="active"><Link to="/home">Home</Link></li>
            <li><Link to="/new">Sign Up</Link></li>
            </ul> */}
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
