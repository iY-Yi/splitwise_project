import Axios from 'axios';
import React, {Component} from 'react';
import {Redirect} from 'react-router';
import { userSignup } from '../../redux/actions/user/signupAction';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cookie from 'react-cookies';

class Signup extends Component{
  state = {
    user: {
        name: '',
        email: '',
        password: '',
    },
    submitted:  false,
    error: '',
  };

  handleChange = (e) => {
    const user = this.state.user;
    user[e.target.name] = e.target.value;
    this.setState({user});
  }

  handleSubmit = (e) => {
      e.preventDefault();
      //this.setState({ submitted: true});
      const {user} = this.state;
      // console.log(user);

      this.props.userSignup(user);
      this.setState({
        submitted: true,
      });
  }

  render(){
    if (this.props && this.props.user && this.props.user._id) {
      return <Redirect to="/dashboard" />;
    }
    console.log(this.props.user);
    let message = '';
    if (this.state.submitted === true && this.props.user && this.props.user.email) {
      // console.log('redirect to dashboard');
      return <Redirect to= "/dashboard" />;
    }
    else if (this.props.user && this.props.user.error) {
      message = this.props.user.error;
    }
      return(
          <div>
              <br/>
              <div className="container">
                  <h2>New User</h2>
                      <form id="userSignUp" onSubmit={this.handleSubmit}>
                      { this.state.submitted === true && message!=='' && <div className="alert alert-danger">{message}</div>}
                          <label>Name:</label><br/>
                          <input className="form-control" type="text" id="name" name="name" onChange={this.handleChange}/><br/>
                          <label>Email:</label><br/>
                          <input className="form-control" type="email" id="email" name="email" placeholder="name@example.com" onChange={this.handleChange}/><br/>
                          <label>Password:</label><br/>
                          <input className="form-control" type="password" id="password" name="password" onChange={this.handleChange}/><br/>
                          <input type = "submit" value = "Submit" className="btn btn-primary"/>
                      </form>
              </div>
          </div>
      );
  }
}

Signup.propTypes = {
  userSignup: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return ({
    user: state.login.user, // state.user in login reducer
    token: state.login.token,
  });
};

// export default Signup;
export default connect(mapStateToProps, { userSignup})(Signup);
