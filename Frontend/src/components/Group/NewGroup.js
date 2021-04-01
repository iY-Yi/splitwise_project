import Axios from 'axios';
import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class NewGroup extends Component{
  state = {
    name: '',
    image: '/default.jpg',
    saveStatus: null,
    fileSelected: '',
    users: [],
    creator: cookie.load('user'),
    // members: [],
    search: '',
    message: '',
    inviteMsg: '',
  };

  //get all users from backend  
  componentDidMount(){
    Axios.get('/group/new')
      .then((response) => {
        //update the state with the response data
        this.setState({
          users : this.state.users.concat(response.data) 
        })
      })
      .catch((e) => {
        this.setState({ message: 'Loading failed!'});
      });
  }

  handleChange = (e) => {
    const { name, value} = e.target;
    this.setState({ name: value});
  }

  handleFileSelect = event => {
    this.setState({
      fileSelected: event.target.files[0]
    });
  }

  searchUser = (e) => {
    this.setState({ search: e.target.value});
  }

  inviteUser = (e) => {
    this.setState({
      inviteMsg : ''});    
    const inviteData= {
      groupName: this.state.name,
      userEmail: e.target.value,
      accepted: 0,
      requestor: cookie.load('user'),
    }
    Axios.post('/group/invite', inviteData)
    .then((response)=>{
      this.setState({
        inviteMsg : 'The user is invited.'});
    })
    .catch((err) => {
      console.log(err);
      this.setState({
        inviteMsg: 'Failed! Unauthorized',
      })
    });
  }

  submitSave = async(e) => {
    e.preventDefault();
    // upload group image
    if (this.state.fileSelected != '') {
      const data = new FormData();
      data.append('file', this.state.fileSelected);
      const res = await Axios.post('/group/upload', data);
      this.setState({image: `/images/${res.data}`});
    }

    // create in database
    const group = {
      name: this.state.name,
      image: this.state.image,
      fileSelected: this.state.fileSelected,
      creator: this.state.creator,
      // members: this.state.members,     
    }
    try {
      const response = await Axios.post("/group/new", group)
      console.log("Group created: ", response.status);
      this.setState({ saveStatus: true,
        message : 'New group is created.'});
      }
    catch (e) {
      console.log(e);
      this.setState({saveStatus: false, message: 'Failed! Duplicate_Name', });
    }
  }

  render(){
    if (!cookie.load('user')) {
      return <Redirect to="/landing" />;
    }
    let searchMembers = this.state.users.filter((data) => {
      if (this.state.search !== '' && (data.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
      data.email.toLowerCase().includes(this.state.search.toLowerCase()))){
        return data;
      }
    })
    .map(user => {
      return(
          <tr>
            <td>{user.name}</td>
            <td>                                
              <button type="button" className="btn btn-secondary btn-sm" value={user.email} onClick={(e)=>this.inviteUser(e)}>Invite</button>                
            </td>
          </tr>
      )
    });

    return(
      <div className="container-fluid">
        <h3>GROUP</h3>
        <div className = "row">
          <div className="col-md-4">
            <form>
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                <img src= {this.state.image} width="200" /> 
                <input type="file" onChange={this.handleFileSelect} accept="image/*"/>
              </div>
            </form>
          </div>
          <div className="col-md-8">
            <form>
              <label>Group Name</label><br/>
              <input className="form-control" type="text" id="name" name="name" value={this.state.name} onChange={this.handleChange} disabled={this.state.saveStatus}/><br/>
              <input type = "Button" value = "Save" readOnly className="btn btn-success btn-lg" onClick={this.submitSave}/>
              <br />
              { this.state.message!=='' && <div className="alert alert-info">{this.state.message}</div>}
              <br />
              <h4>Invite User</h4>
              { this.state.inviteMsg!=='' && <div className="alert alert-info">{this.state.inviteMsg}</div>}
              <input type="text" className="form-control" placeholder="Enter to search for a user" onChange={(e)=>this.searchUser(e)} />
              <table className="table">
                <tbody>
                {searchMembers}
                </tbody>
              </table>
            </form>
            &nbsp;&nbsp;&nbsp;
            
          </div>
        </div>
      </div>
    );
  }
}

export default NewGroup;