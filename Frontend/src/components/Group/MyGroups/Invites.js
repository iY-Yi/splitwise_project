import Axios from 'axios';
import React, {Component} from 'react';
import cookie from 'react-cookies';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { acceptInvite } from '../../../redux/actions/group/groupsAction';
// import { getCurrentUser } from '../../../utils/utils';

class Invites extends Component{
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  acceptGroup = (e) => {
    const data = {
      group: e.target.value,
      user: this.props.user._id,
    };
    console.log(data);
    this.props.acceptInvite(data);
  }
    // Axios.put('/group/accept', data)
    // .then(()=> {
    //   console.log('success');
    //   // this.setState({ message: 'Join group successfully.' });
    //   // this.componentDidMount();
    // })
    // .catch((err) => {
    //   console.log(err);
    //   // this.setState({ message: 'Join group failed!'});
    // })

  render(){    
    const invitesArray = Array.from(this.props.invites);
    console.log(this.props.invites);
    let invites = invitesArray.filter((inv) => inv !== null)
    .map((invite) => {
      return(
          <tr>
            <td>{invite.name}</td>
            <td>                                
              <button type="button" class="btn btn-secondary btn-sm" value={invite._id} onClick={(e)=>this.acceptGroup(e)}>Accept</button>                
            </td>
          </tr>
      )      
    }); 
   

    return(
        <table class="table table-striped">
          <h5>Pending Invites</h5>
          <tbody>
            {this.props.invites.length > 0 ? invites : <div class="alert alert-info">No pending invites.</div>}
          </tbody>
        </table>
    );
  }
}


Invites.propTypes = {
  acceptInvite: PropTypes.func.isRequired,
  invites: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  invites: state.groups.invites,
  user: state.login.user,
});

export default connect(mapStateToProps, { acceptInvite })(Invites);