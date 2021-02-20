import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Signup from './User/Signup';
import Navbar from './LandingPage/Navbar';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/new" component={Signup}/>
                <Route path="/" component={Navbar}/>
            </div>
        )
    }
}
//Export The Main Component
export default Main;