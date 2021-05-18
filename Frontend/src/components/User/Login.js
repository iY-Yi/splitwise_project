// import Axios from 'axios';
import React, {Component} from 'react';
import {Redirect} from 'react-router';
import { userLogin } from '../../js/actions/loginAction';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import { graphql } from 'react-apollo';
import { userLoginMutation } from '../../mutation/mutation';

class Login extends Component{

  constructor(props) {
    super(props);
    this.state = { submitFlag: false, message: '' };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  submitLogin = async (e) => {
    e.preventDefault();
    let mutationResponse = await this.props.userLoginMutation({
      variables: {
        email: this.state.email,
        password: this.state.password,
      }
    });
    console.log(mutationResponse);
    const response = mutationResponse.data.userLogin;
    if (response && response.status === '200') {
      this.setState({
        message: '',
      });
      localStorage.setItem('user', this.state.email);
      localStorage.setItem('currency', 'USD');
      localStorage.setItem('timezone', 'US/Pacific');

    } else {
      this.setState({
        message: response.message,
      });      
    }
    this.setState({
      submitFlag: true,
    });
  }

  render(){
    if (localStorage.getItem('user')) {
      return <Redirect to="/dashboard" />;
    }
    // console.log('props:', this.props);
    // let message = '';
    // if (this.props.user && this.props.user.email) {
    //   return <Redirect to= "/dashboard" />;
    // }
    // else if (this.props.user === 'NO_USER') {
    //   message = 'NO_USER';
    // }
    // else if (this.props.user === 'WRONG_PASSWORD') {
    //   message = 'WRONG_PASSWORD';
    // }

    return(
      <div>
        <br/>
        <div className="container">
            <h3>Log In</h3>
              <form id="userLogin" onSubmit={this.submitLogin}>
              { this.state.submitFlag === true && this.state.message!=='' && <div class="alert alert-danger">{this.state.message}</div>}
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

// login component includes user object and userLogin action/function.
// define available prop types accessable in login component 
// Login.propTypes = {
//   userLogin: PropTypes.func.isRequired,
//   user: PropTypes.object.isRequired
// }

// const mapStateToProps = (state) => {
//   return ({
//     user: state.login.user // user in login reducer
//   });
// };

// // export default Login;
// export default connect(mapStateToProps, { userLogin})(Login);
export default graphql(userLoginMutation, { name: "userLoginMutation" })(Login);