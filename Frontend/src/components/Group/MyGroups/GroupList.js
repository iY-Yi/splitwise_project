import Axios from 'axios';
import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { leaveGroup } from '../../../redux/actions/group/groupsAction';
import { getCurrentUser } from '../../../utils/utils';

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
    console.log(getCurrentUser());
    const data = {
      group: e.target.value,
      user: getCurrentUser(),
    };
    this.props.leaveGroup(data);
    // this.setState({ message: '' });

    // Axios.post('/group/leave', data)
    // .then(()=> {
    //   this.setState({ message: 'Leave group successfully.' });
    //   this.componentDidMount();
    // })
    // .catch((err) => {
    //   this.setState({ message: 'Failed: OPEN_BALANCE' });
    // })
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
          <td><a href={"/group/expense/"+ group._id}>{group.name}</a></td>
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
};

const mapStateToProps = state => ({
  groups: state.groups.groups,
});

export default connect(mapStateToProps, { leaveGroup })(GroupList);