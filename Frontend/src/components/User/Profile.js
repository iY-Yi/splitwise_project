import Axios from 'axios';
import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class Profile extends Component{
  state = {
    user: {
      name: '',
      email: '',
      phone: '',
      avatar: '',
      currency: '',
      timezone: '',
      language: '',
    },
    error: '',
    fileSelected: '',
    saveStatus: null,
    disabled: true,
  };

  componentDidMount(){
    const id = cookie.load('user');
    console.log(id);
    Axios.get(`/user/profile/${id}`)
            .then((response) => {
            this.setState({ user : response.data });
            console.log(this.state);
        });
  }

  handleChange = (e) => {
    const user = this.state.user;
    user[e.target.name] = e.target.value;
    this.setState({user});
  }

  handleFileSelect = event => {
    this.setState({
      fileSelected: event.target.files[0]
    });
  }

  submitSave = async(e) => {
    e.preventDefault();
    // upload avatar image
    if (this.state.fileSelected != '') {
      const data = new FormData();
      data.append('file', this.state.fileSelected);
      const res = await Axios.post('/user/upload', data);
      const user = this.state.user;
      user['avatar'] = `/images/${res.data}`;
      this.setState({user});
    }

    // update in database
    const {user} = this.state;
    console.log(user);
    try {
      const response = await Axios.post("/user/update", user)
      console.log("Profile saved: ", response.status);
      this.setState({ saveStatus: true, disabled: true});
      }
    catch (e) {
      console.log(e);
      this.setState({saveStatus: false});
    }
  }

  handleEditClick = () => {
    const editStatus = !this.state.disabled;
    this.setState({ disabled: editStatus});
  }

  render(){
    return(
      <div className="container-fluid">
        <h3>Your account</h3>
        <form id="profile" onSubmit={this.submitSave}>
        {/* { this.state.authFlag === false && <div class="alert alert-danger">Log in failed!</div>} */}
          <div class = "row">
            <div class="col-md-4 border-right">
              <div class="d-flex flex-column align-items-center text-center p-3 py-5">
                <img src= {this.state.user.avatar} width="200" /> 
                <p>Change your avatar</p>
                <input type="file" onChange={this.handleFileSelect} accept="image/*"/>
              </div>
            </div>
            <div class="col-md-4">
              <label for="name">Name:</label><br/>
              <input class="form-control" type="text" id="name" name="name" value={this.state.user.name} disabled={this.state.disabled} onChange={this.handleChange}/><br/>
              <label for="email">Email:</label><br/>
              <input class="form-control" type="email" id="email" name="email" value={this.state.user.email} disabled={this.state.disabled} onChange={this.handleChange}/><br/>
              <label for="phone">Phone Number:</label><br/>
              <input class="form-control" type="tel" id="phone" name="phone" value={this.state.user.phone} disabled={this.state.disabled} onChange={this.handleChange}/><br/> 
            </div>
            <div class="col-md-4">
              <label for="currency">Default currency:</label><br/>
              <select class="form-control" name="currency" id="currency" value={this.state.user.currency} disabled={this.state.disabled} onChange={this.handleChange}>
                <option value="USD">USD</option>
                <option value="KWD">KWD</option>
                <option value="BHD">BHD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
                <option value="CAD">CAD</option>
              </select><br/>
              <label for="timezone">Time zone:</label><br/>
              <select class="form-control" name="timezone" id="timezone" value={this.state.user.timezone} disabled={this.state.disabled} onChange={this.handleChange}>
                <option value="todo">ToDo</option>
              </select><br/>               
              <label for="language">Language:</label><br/>
              <select class="form-control" name="language" id="language" value={this.state.user.language} disabled={this.state.disabled} onChange={this.handleChange}>
                <option value="English">English</option>
              </select><br/>              
              <input type = "button" value = "Edit" class="btn btn-secondary btn-lg" onClick={this.handleEditClick}/>
              &nbsp;&nbsp;&nbsp;
              <input type = "submit" value = "Save" class="btn btn-success btn-lg"/>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Profile;