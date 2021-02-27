import React, { Component } from 'react';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';

class Landing extends Component {
  render() {
    if (cookie.load('user')) {
      return <Redirect to="/dashboard" />;
    }
    return (

      <div className="container">
        <img src="landing.png" className="mx-auto d-block" alt="Landing" />
        <a className="btn btn-secondary" href="/user/signup">Sing Up</a>
      </div>
    );
  }
}

export default Landing;
