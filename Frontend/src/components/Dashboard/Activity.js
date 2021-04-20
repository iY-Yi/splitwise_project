import React, { Component } from 'react';
import numeral from 'numeral';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getActivity } from '../../redux/actions/activityAction';
import { dateTimeFormat } from '../../utils/utils';

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {

      filterGroup: '',
      sort: '',
      currentPage: 1,
      pageSize: 2,
      // entryCount: 1,
      // maxPage: 1,
    };
  }

  // get all users from backend
  componentDidMount() {
    this.props.getActivity(this.props.user._id);
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  pageClick(number) {
    console.log(number);
    this.setState({
      currentPage: number
    });
  }

  filterGroup = (e) => {
    this.setState({ filterGroup: e.target.value});
  }

  sorting = (e) => {
    this.setState({ sort: e.target.value});
  }

  render() {
    if (!this.props || !this.props.user || !this.props.user._id) {
      return <Redirect to="/landing" />;
    }    
    const currency = this.props.user.currency;
    const timezone = this.props.user.timezone;

    const groupList = this.props.groups.map((group) => (
      <option value={group}>{group}</option>
    ));
    
    // console.log(indexOfFirst);
    // console.log(indexOfLast);

    const filteredList = this.props.activities.filter((data) => {
      if (data.group.name.includes(this.state.filterGroup)) {
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
    });

    const {currentPage, pageSize} = this.state;
    const indexOfLast = currentPage * pageSize;
    const indexOfFirst = indexOfLast - pageSize;

    const activityList = filteredList.slice(indexOfFirst, indexOfLast)
    .map((activity) => (
      <tr>
        {/* <td>{ new Date(activity.date)}</td> */}
        <td>{dateTimeFormat(activity.date, timezone)}</td>
        <td>{activity.payor.name} paid {numeral(activity.amount).format('0,0.00')} {currency} for {activity.description} in group {activity.group.name}</td>
      </tr>
    ));

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredList.length / this.state.pageSize); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        // <li class="page-item" key={number} id={number}  onClick={e => this.pageClick(e)}>
        <li class="page-item" key={number} id={number}>
          <a class="page-link" onClick={()=>this.pageClick(number)}>
            {number}
          </a>
        </li>
      );
    });


    return (    
      <div className="container-fluid">
        <h3>
          Recent activity
        </h3>
        { this.props.message !== '' && <div className="alert alert-info">{this.props.message}</div>}
        <br />
        <div className="row">
          <div className="col-sm-2">
            <label>Filter group: </label>
          </div>
          <div className="col-sm-2">
            <select className="form-control" name="group" id="group" value={this.state.filterGroup} onChange={this.filterGroup}>
              <option value=''>All groups</option>
              {groupList}
            </select>
          </div>
          <div className="col-sm-1">
            <label>Sort: </label>
          </div>
          <div className="col-sm-3">
            <select className="form-control" name="sort" id="sort" value={this.state.sort} onChange={this.sorting}>
              <option value='desc'>Most recent first</option>
              <option value='asc'>Most recent last</option>
            </select>
          </div>
          <div className="col-sm-2">
            <label>Entries per page: </label>
          </div>
          <div className="col-sm-2">
            <select className="form-control" name="pageSize" id="pageSize" value={this.state.pageSize} onChange={this.handleChange}>
              <option value='2'>2</option>
              <option value='5'>5</option>
              <option value='10'>10</option>
            </select>
          </div>

        </div>
        <br />
        { this.props.activities.length === 0 && <div className="alert alert-info">No activities.</div>}
          <table className="table">
            <tbody>
              {activityList}
            </tbody>
          </table>
          <ul class="pagination justify-content-center">
            {renderPageNumbers}
          </ul>
      </div>

    );
  }
}

Activity.propTypes = {
  getActivity: PropTypes.func.isRequired,
  activities: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  activities: state.activity.activities,
  groups: state.activity.groups,
  message: state.activity.message,
  user: state.login.user,
});

export default connect(mapStateToProps, { getActivity })(Activity);

