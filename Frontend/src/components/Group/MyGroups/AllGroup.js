import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGroups } from '../../../redux/actions/group/groupsAction';
import Invites from './Invites';
import GroupList from './GroupList';
import { Link } from 'react-router-dom';

class AllGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const userId = this.props.user._id;
    this.props.getGroups(userId);
  }

  render() {
    if (!cookie.load('user')) {
      return <Redirect to="/landing" />;
    }

    return (
      <div className="container-fluid">
        <h3>My Groups</h3>
        <Link to="/group/new" className="btn btn-info">New Group</Link>
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
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.login.user,
});

export default connect(mapStateToProps, { getGroups })(AllGroup);
