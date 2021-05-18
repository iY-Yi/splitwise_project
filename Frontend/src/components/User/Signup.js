// import Axios from 'axios';
import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
import {Redirect} from 'react-router';
// import { userSignup } from '../../js/actions/signupAction';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import cookie from 'react-cookies';
// import qlQuery from '../../util';
import { userSignUpMutation } from '../../mutation/mutation';

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

  handleSubmit = async (e) => {
      e.preventDefault();
      //this.setState({ submitted: true});
      const {user} = this.state;
      // console.log(user);
      // (async () => {
      //   // Mutation addUser
      //   console.log(user);
      //   console.log(await qlQuery(
      //       // "mutation _($userInput: UserSignup) {addUser(user: $userInput) {email currency timezone}}",
      //       userSignUpMutation,
      //       {"userInput": user} //variables need to passed as the second argument
      //   ));
      let mutationResponse = await this.props.userSignUpMutation({
        variables: {
          email: user.email,
          name: user.name,
          password: user.password,
        }
      });
      console.log(mutationResponse);
      const response = mutationResponse.data.userSignup;
      // console.log(response);
      if (response && response.status === '200') {
        this.setState({
          message: '',
        });
        localStorage.setItem('user', this.state.user.email);
        localStorage.setItem('currency', 'USD');
        localStorage.setItem('timezone', 'US/Pacific');
  
      } else {
        this.setState({
          message: response.message,
        });      
      }
      this.setState({
        submitted: true,
      });

      // this.props.userSignUpMutation({
      //   variables: {
      //       email: user.email,
      //       name: user.name,
      //       password: user.password,
      //   },
      //   // refetchQueries: [{ query: getBooksQuery }]
      // });

      //   this.setState({ submitted: true});
      //   localStorage.setItem('user', this.state.user.email);
      //   localStorage.setItem('currency', 'USD');
      //   localStorage.setItem('timezone', 'US/Pacific');
      // // })();      

      // this.props.userSignup(user);
      // this.setState({
      //   submitted: true,
      // });

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
    if (localStorage.getItem('user')) {
      return <Redirect to="/dashboard" />;
    }
    // console.log('In signup', this.props);
    // let message = '';
    // if (this.state.submitted === true && this.props.user && this.props.user.email) {
    if (this.state.submitted === true) {
      // console.log('redirect to dashboard');
      return <Redirect to= "/dashboard" />;
    }
    // else if (this.props.user && this.props.user.errors) {
    //   message = 'User sign up failed!';
    // }
      return(
          <div>
              <br/>
              <div className="container">
                  <h2>New User</h2>
                      <form id="userSignUp" onSubmit={this.handleSubmit}>
                      { this.state.submitted === true && this.state.message!=='' && <div className="alert alert-danger">{this.state.message}</div>}
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
// export default Signup;
export default graphql(userSignUpMutation, { name: "userSignUpMutation" })(Signup);

