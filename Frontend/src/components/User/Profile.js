import Axios from 'axios';
import React, {Component} from 'react';
import cookie from 'react-cookies';
import moment from 'moment-timezone'; 
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
    // console.log(id);
    Axios.get(`/user/profile/${id}`)
            .then((response) => {
            this.setState({ user : response.data });
            // console.log(this.state);
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
    // console.log(user);
    try {
      const response = await Axios.put("/user/update", user)
      // console.log("Profile saved: ", response.status);
      this.setState({ saveStatus: true, disabled: true});
      }
    catch (e) {
      // console.log(e);
      this.setState({saveStatus: false});
    }
  }

  handleEditClick = () => {
    const editStatus = !this.state.disabled;
    this.setState({ disabled: editStatus});
  }

  render(){
    const timeZones = moment.tz.names().map((name) => {
      return(
      <option value={name} key={name}>{name}</option>
      )
    });
    return(
      <div className="container-fluid">
        <h3>Your account</h3>
        <form id="profile" onSubmit={this.submitSave}>
        {/* { this.state.authFlag === false && <div class="alert alert-danger">Log in failed!</div>} */}
          <div className = "row">
            <div className="col-md-4 border-right">
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                <img src= {this.state.user.avatar} width="200" /> 
                <p>Change your avatar</p>
                <input type="file" onChange={this.handleFileSelect} accept="image/*"/>
              </div>
            </div>
            <div className="col-md-4">
              <label>Name:</label><br/>
              <input className="form-control" type="text" id="name" name="name" value={this.state.user.name} disabled={this.state.disabled} onChange={this.handleChange}/><br/>
              <label>Email:</label><br/>
              <input className="form-control" type="email" id="email" name="email" value={this.state.user.email} disabled={this.state.disabled} onChange={this.handleChange}/><br/>
              <label>Phone Number:</label><br/>
              <input className="form-control" type="tel" id="phone" name="phone" value={this.state.user.phone} disabled={this.state.disabled} onChange={this.handleChange}/><br/> 
            </div>
            <div className="col-md-4">
              <label>Default currency:</label><br/>
              <select className="form-control" name="currency" id="currency" value={this.state.user.currency} disabled={this.state.disabled} onChange={this.handleChange}>
                <option value="USD">USD</option>
                <option value="KWD">KWD</option>
                <option value="BHD">BHD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
                <option value="CAD">CAD</option>
              </select><br/>
              <label>Time zone:</label><br/>
              <select className="form-control" name="timezone" id="timezone" value={this.state.user.timezone} disabled={this.state.disabled} onChange={this.handleChange}>
                {timeZones}
              </select><br/>               
              <label>Language:</label><br/>
              <select className="form-control" name="language" id="language" value={this.state.user.language} disabled={this.state.disabled} onChange={this.handleChange}>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
              </select><br/>              
              <input type = "button" value = "Edit" className="btn btn-secondary btn-lg" onClick={this.handleEditClick}/>
              &nbsp;&nbsp;&nbsp;
              <input type = "submit" value = "Save" className="btn btn-success btn-lg"/>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Profile;