import {
  GET_GROUPS, LEAVE_GROUP_FAIL, LEAVE_GROUP_SUCCESS, ACCEPT_INVITE_SUCCESS, ACCEPT_INVITE_FAIL,
} from '../../actions/types';

const initialState = {
  groups: [],
  invites: [],
};

function groupsReducer(state = initialState, action) {
  // console.log(action.payload);
  switch (action.type) {
    case GET_GROUPS:
      return {
        ...state,
        groups: action.payload.groups, // add user to state
        invites: action.payload.invites,
      };
    case LEAVE_GROUP_FAIL:
      alert(`FAIL: ${action.payload.error}`);
      return { ...state };

    case LEAVE_GROUP_SUCCESS:
      console.log(state);
      return {
        ...state,
        groups: action.payload,
      };

    case ACCEPT_INVITE_FAIL:
      // console.log(action.playload);
      alert(`FAIL: ${action.payload}`);
      // return { ...state };
      return { ...state };

    case ACCEPT_INVITE_SUCCESS:
      return {
        ...state,
        groups: action.payload.groups,
        invites: action.payload.invites,
      };
    default:
      return state;
  }
}

export default groupsReducer;
