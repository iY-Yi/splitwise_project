import Axios from 'axios';
import React, {Component} from 'react';
import {Redirect} from 'react-router';

class Signup extends Component{
    state = {
        user: {
            name: '',
            email: '',
            password: '',
        },
        submitted:  null,
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

        Axios.post("/user/signup", user)
        .then((response)=> {
            console.log("Successful: ", response.status);
            this.setState({ submitted: true});
        })
        .catch((err) => {
            console.log("Error", err);
            this.setState({ submitted : false});
        });
     
    }

    render(){
        if (this.state.submitted === true) {
            return <Redirect to= "/home" />;
        }
        return(
            <div>
                <br/>
                <div className="container">
                    <h2>New User</h2>
                        <form id="userSignUp" onSubmit={this.handleSubmit}>
                        { this.state.submitted === false && <div class="alert alert-danger">New user sign up failed.</div>}
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

export default Signup;