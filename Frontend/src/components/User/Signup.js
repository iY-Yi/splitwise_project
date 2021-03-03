import Axios from 'axios';
import React, {Component} from 'react';
import {Redirect} from 'react-router';
import { userSignup } from '../../js/actions/signupAction';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
      console.log(user);

      this.props.userSignup(user);
      this.setState({
        submitted: true,
      });

      // Axios.post("/user/signup", user)
      // .then((response)=> {
      //     console.log("Successful: ", response.status);
      //     this.setState({ submitted: true});
      // })
      // .catch((err) => {
      //     console.log("Error", err);
      //     this.setState({ submitted : false});
      // });
    
  }

  render(){
    // console.log('In signup', this.props);
    let message = '';
    if (this.state.submitted === true && this.props.user && this.props.user.email) {
      // console.log('redirect to dashboard');
      return <Redirect to= "/dashboard" />;
    }
    else if (this.props.user && this.props.user.errors) {
      message = 'User sign up failed!';
    }
      return(
          <div>
              <br/>
              <div className="container">
                  <h2>New User</h2>
                      <form id="userSignUp" onSubmit={this.handleSubmit}>
                      { this.state.submitted === true && message!=='' && <div class="alert alert-danger">{message}</div>}
                          <label for="name">Name:</label><br/>
                          <input class="form-control" type="text" id="name" name="name" onChange={this.handleChange}/><br/>
                          <label for="email">Email:</label><br/>
                          <input class="form-control" type="email" id="email" name="email" placeholder="name@example.com" onChange={this.handleChange}/><br/>
                          <label for="password">Password:</label><br/>
                          <input class="form-control" type="password" id="password" name="password" onChange={this.handleChange}/><br/>
                          <input type = "submit" value = "Submit" class="btn btn-primary"/>
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
    user: state.login.user // state.user in login reducer
  });
};

// export default Signup;
export default connect(mapStateToProps, { userSignup})(Signup);
