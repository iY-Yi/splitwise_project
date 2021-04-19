import React, { Component } from 'react';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Landing extends Component {
  render() {
    if (this.props && this.props.user && this.props.user._id) {
      return <Redirect to="/dashboard" />;
    }
    return (

      <div className="container">
        <img src="landing.png" className="mx-auto d-block" alt="Landing" />
        <a className="btn btn-secondary" href="/user/signup">Sign Up</a>
      </div>
    );
  }
}

Landing.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.login.user,
});

export default connect(mapStateToProps, {})(Landing);
