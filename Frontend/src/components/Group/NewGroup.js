import Axios from 'axios';
import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserList, newGroup, sendInvite } from '../../redux/actions/group/newGroupAction';
// import { getCurrentUser } from '../../utils/utils';

class NewGroup extends Component{

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      image: '/default.jpg',
      fileSelected: '',
      search: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.submitSave = this.submitSave.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.inviteUser = this.inviteUser.bind(this);
  }


  //get all users from backend  
  componentDidMount(){
    this.props.getUserList();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
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
    this.setState({ inviteMsg : ''});    
    const inviteData= {
      groupName: this.state.name,
      user: e.target.value,
      requestor: this.props.user._id,
    }
    this.props.sendInvite(inviteData);
  }
  //   Axios.post('/group/invite', inviteData)
  //   .then((response)=>{
  //     this.setState({
  //       inviteMsg : 'The user is invited.'});
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     this.setState({
  //       inviteMsg: 'Failed! Unauthorized',
  //     })
  //   });
  // }

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
      creator: this.props.user._id,
      // members: this.state.members,     
    }
    this.props.newGroup(group);
  }

  render(){
    if (!cookie.load('user')) {
      return <Redirect to="/landing" />;
    }

    const usersArray = Array.from(this.props.users);
    console.log(usersArray);
    let searchMembers = usersArray.filter((data) => {
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
              <button type="button" className="btn btn-secondary btn-sm" value={user._id} onClick={(e)=>this.inviteUser(e)}>Invite</button>                
            </td>
          </tr>
      )
    });

    let message = '';
    let saved = false;
    if (this.props.group.error) {
      message = `FAIL: ${this.props.group.error}`;
    }
    else if (this.props.group.message) {
      saved = true;
    }

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
              <input className="form-control" type="text" id="name" name="name" value={this.state.name} onChange={this.handleChange} disabled={saved}/><br/>
              <input type = "Button" value = "Save" readOnly className="btn btn-success btn-lg" onClick={this.submitSave}/>
              <br />
              { message!=='' && <div className="alert alert-info">{message}</div>}
              <br />
              <h4>Invite User</h4>
              {/* { this.state.inviteMsg!=='' && <div className="alert alert-info">{this.state.inviteMsg}</div>} */}
              <input type="text" className="form-control" placeholder="Enter to search for a user" onChange={(e)=>this.searchUser(e)} />
              <table className="table">
                <tbody>
                {this.props.users.length > 0 ? searchMembers : <p />}
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

NewGroup.propTypes = {
  getUserList: PropTypes.func.isRequired,
  newGroup: PropTypes.func.isRequired,
  sendInvite: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  users: state.newGroup.users,
  group: state.newGroup.group,
  user: state.login.user,
});

export default connect(mapStateToProps, { getUserList, newGroup, sendInvite })(NewGroup);