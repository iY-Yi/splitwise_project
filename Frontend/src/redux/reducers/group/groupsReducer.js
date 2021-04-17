import {
  GET_GROUPS, LEAVE_GROUP, GET_INVITES, ACCEPT_INVITE,
} from '../../actions/types';

const initialState = {
  groups: {},
  invites: {},
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
    case LEAVE_GROUP:
      return {
        ...state,
        groups: action.payload,
      };
    case GET_INVITES:
      return {
        ...state,
        invites: action.payload,
      };
    case ACCEPT_INVITE:
      return {
        ...state,
        invites: action.payload,
      };
    default:
      return state;
  }
}

export default groupsReducer;
