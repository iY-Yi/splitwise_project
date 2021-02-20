// import Axios from 'axios';
import React, {Component} from 'react';
// import {Redirect} from 'react-router';

class Signup extends Component{
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         user: {
    //             name: '',
    //             email: '',
    //             password: '',
    //         },
    //         submitted:  null
    //     };
    //     this.changeHandler = this.changeHandler.bind(this);
    //     this.submitHandle = this.submitHandle.bind(this);
    // }

    // componentWillMount(){
    //     this.setState({ submitted: null});
    // }

    // changeHandler = (e) => {
    //     const { name, value } = e.target;
    //     const { user } = this.state;
    //     this.setState({
    //         user : {
    //             ...user,
    //             [name]: value
    //         }
    //     });
    // }

    // submitHandle = (e) => {
    //     //var headers = new Headers();
    //     e.preventDefault();
    //     //this.setState({ submitted: true});
    //     const {user} = this.state;
    //     console.log(user);

    //     Axios.post("/register", user)
    //     .then((response)=> {
    //         console.log("Successful: ", response.status);
    //         this.setState({ submitted: true});
    //         this.props.addUser(user);
    //     })
    //     .catch((err) => {
    //         console.log("Error", err);
    //         this.setState({ submitted : false});
    //     });
     
    // }

    render(){
        // //console.log(this.state.createFlag);
        // if (this.state.submitted === true) {
        //     console.log("Successful created. Redirect.")
        //     return <Redirect to= "/login" />;
        // }
        return(
            <div>
                <br/>
                <div className="container">
                    <h2>New User</h2>
                        <form action = "/new" method="post" id="userSignUp">
                            <label for="name">Name:</label><br/>
                            <input class="form-control" type="text" id="name" name="name"/><br/>
                            <label for="email">Email:</label><br/>
                            <input class="form-control" type="email" id="email" name="email" placeholder="name@example.com"/><br/>
                            <label for="password">Password:</label><br/>
                            <input class="form-control" type="password" id="password" name="password"/><br/>
                            <input type = "submit" value = "Submit" class="btn btn-primary"/>
                        </form>
                </div>
            </div>
        );
    }
}

export default Signup;