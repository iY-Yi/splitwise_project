import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGroups } from '../../../redux/actions/group/groupsAction';
import Invites from './Invites';
import GroupList from './GroupList';

class AllGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getGroups();
  }

  render() {
    if (!cookie.load('user')) {
      return <Redirect to="/landing" />;
    }

    return (
      <div className="container-fluid">
        <h3>My Groups</h3>

        <a className="btn btn-info" href="/group/new">New Group</a>
        <br />
        <br />
        <Invites />
        <GroupList />
      </div>
    );
  }
}

AllGroup.propTypes = {
  getGroups: PropTypes.func.isRequired,
};

export default connect(null, { getGroups })(AllGroup);
