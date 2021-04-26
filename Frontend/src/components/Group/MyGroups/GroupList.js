// import Axios from 'axios';
import React, {Component} from 'react';
// import cookie from 'react-cookies';
// import {Redirect} from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { leaveGroup } from '../../../redux/actions/group/groupsAction';
// import { getCurrentUser } from '../../../utils/utils';

class GroupList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      // message: '',
    };
  }

  searchGroup = (e) => {
    this.setState({ search: e.target.value});
  }

  leaveGroup = (e) => {
    const data = {
      group: e.target.value,
      user: this.props.user._id
    };
    this.props.leaveGroup(data);
  }

  render(){
    console.log(this.props.groups);
    const groupsArray = Array.from(this.props.groups);

    let allGroup = groupsArray.filter((group)=> {
      if (group.name.toLowerCase().includes(this.state.search.toLowerCase())) {
        return group;
      }
    })
    .map((group) => {
      return(
        <tr>
          <td><Link to={"/group/expense/"+ group._id}>{group.name}</Link></td>
          <td>                                
            <button type="button" class="btn btn-secondary btn-sm" value={group._id} onClick={(e)=>this.leaveGroup(e)}>Leave</button>                
          </td>
        </tr>
      )      
    });      

    return(
      <div>
        <h5>Search Group</h5>
        <input type="text" class="form-control" placeholder="Search a group" onChange={(e)=>this.searchGroup(e)} />
        <br />
        <table class="table table-striped">
          <h5>Joined Groups</h5>
          <tbody>
            {this.props.groups.length > 0? allGroup : <div class="alert alert-info">No joined groups.</div>}
          </tbody>
        </table>
      </div>
    );
  }
}

GroupList.propTypes = {
  leaveGroup: PropTypes.func.isRequired,
  groups: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  groups: state.groups.groups,
  user: state.login.user,
});

export default connect(mapStateToProps, { leaveGroup })(GroupList);