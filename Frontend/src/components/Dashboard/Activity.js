import Axios from 'axios';
import React, { Component } from 'react';
import cookie from 'react-cookies';
import numeral from 'numeral';
// import { Redirect } from 'react-router';

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      groups: [],
      filterGroup: '',
      sort: '',
      message: '',
    };
  }

  // get all users from backend
  componentDidMount() {
    const { group } = this.state;
    console.log(group);
    Axios.get('/activity', {
      params: {
        user: cookie.load('user'),
      },
    })
      .then((response) => {
        // update the state with the response data
        // console.log(response.data.balances);
        this.setState({
          activities: response.data.activities,
          groups: response.data.groupNames,
          sort: 'desc',
        });
      });
  }

  filterGroup = (e) => {
    this.setState({ filterGroup: e.target.value});
  }

  sorting = (e) => {
    this.setState({ sort: e.target.value});
  }

  render() {
    const groupList = this.state.groups.map((group) => (
      <option value={group}>{group}</option>
    ));

    const activityList = this.state.activities.filter((data) => {
      if (data.group.includes(this.state.filterGroup)) {
        return data;
      }
    })
    .sort((a, b) => {
      if (this.state.sort === 'asc') {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;        
      }
      else {
        if (b.date < a.date) return -1;
        if (b.date > a.date) return 1;
        return 0;          
      }
    })
    .map((activity) => (
      <tr>
        <td>{activity.date}</td>
        <td>{activity.user.name} paid {activity.amount} for {activity.description} in group {activity.group}</td>
      </tr>
    ));



    return (
      <div className="container-fluid">
        <h3>
          Recent activity
        </h3>
        { this.state.message !== '' && <div className="alert alert-info">{this.state.message}</div>}
        <br />
        <div class="row">
          <div class="col-sm-2">
            <label>Filter group: </label>
          </div>
          <div class="col-sm-4">
            <select className="form-control" name="group" id="group" value={this.state.filterGroup} onChange={this.filterGroup}>
              <option value=''>All groups</option>
              {groupList}
            </select>
          </div>
          <div class="col-sm-2">
            <label>Sort: </label>
          </div>
          <div class="col-sm-4">
            <select className="form-control" name="sort" id="sort" value={this.state.sort} onChange={this.sorting}>
              <option value='desc'>Most recent first</option>
              <option value='asc'>Most recent last</option>
            </select>
          </div>
        </div>
        <br />
          <table className="table">
            <tbody>
              {activityList}
            </tbody>
          </table>
      </div>

    );
  }
}

export default Activity;
