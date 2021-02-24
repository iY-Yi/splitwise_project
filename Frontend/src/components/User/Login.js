import Axios from 'axios';
import React, {Component} from 'react';
import {Redirect} from 'react-router';

class Login extends Component{
  state = {
    email : "",
    password : "",
    authFlag : null
  }

  handleChange = (e) => {
    // user[e.target.name] = e.target.value;
    this.setState({[e.target.name]: e.target.value});
  }

  submitLogin = (e) => {
      e.preventDefault();
      //this.setState({ submitted: true});
      const data = {
          email : this.state.email,
          password : this.state.password
      }
      console.log(data);

      Axios.post("/user/login", data)
      .then((response)=> {
          if(response.status === 200){
            // console.log(response.status);
            this.setState({
                authFlag : true
            })
        }
      })
      .catch((err) => {
        this.setState({
          authFlag : false
        })
      }); 
  }

    render(){
      if (this.state.authFlag === true) {
          return <Redirect to= "/home" />;
      }
      return(
          <div>
              <br/>
              <div className="container">
                  <h3>Log In</h3>
                      <form id="userLogin" onSubmit={this.submitLogin}>
                      { this.state.authFlag === false && <div class="alert alert-danger">Log in failed!</div>}
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

export default Login;