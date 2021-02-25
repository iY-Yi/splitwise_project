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
    members: [cookie.load('user')],
    search: '',
  };

  //get all users from backend  
  componentDidMount(){
    Axios.get('/group/new')
      .then((response) => {
      //update the state with the response data
      this.setState({
        users : this.state.users.concat(response.data) 
      });
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
    const group = this.state;
    try {
      const response = await Axios.post("/group/new", group)
      console.log("Group created: ", response.status);
      this.setState({ saveStatus: true});
      }
    catch (e) {
      console.log(e);
      this.setState({saveStatus: false});
    }
  }

  render(){
    let members = this.state.users.filter((data) => {
      if (this.state.search !== '' && (data.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
      data.email.toLowerCase().includes(this.state.search.toLowerCase()))){
        return data;
      }
    })
    .map(user => {
      return(
      <table class="table">
        <tbody>
          <tr>
            <td>{user.name}</td>
          </tr>
        </tbody>
      </table>
      )
    })

    return(
      <div className="container-fluid">
        <h3>START A NEW GROUP</h3>
        <div class = "row">
          <div class="col-md-4">
            <form>
              <div class="d-flex flex-column align-items-center text-center p-3 py-5">
                <img src= {this.state.image} width="200" /> 
                <input type="file" onChange={this.handleFileSelect} accept="image/*"/>
              </div>
            </form>
          </div>
          <div class="col-md-8">
            <form>
              <label for="name">My group shall be called...</label><br/>
              <input class="form-control" type="text" id="name" name="name" value={this.state.name} onChange={this.handleChange}/><br/>

              <input type="text" class="form-control" placeholder="Enter to search for a user" onChange={(e)=>this.searchUser(e)} />
                {members}
            </form>
            &nbsp;&nbsp;&nbsp;
            <input type = "Button" value = "Save" class="btn btn-success btn-lg" onClick={this.submitSave}/>
          </div>
        </div>
      </div>
    );
  }
}

export default NewGroup;