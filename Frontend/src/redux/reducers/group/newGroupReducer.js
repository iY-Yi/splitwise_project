import {
  NEW_GROUP, GET_USER_LIST_SUCCESS, GET_USER_LIST_FAIL, SEND_INVITE,
} from '../../actions/types';

const initialState = {
  group: {},
  users: [],
};

function newGroupReducer(state = initialState, action) {
  // console.log(action.payload);
  switch (action.type) {
    case GET_USER_LIST_SUCCESS:
      return {
        ...state,
        users: action.payload,
        group: {},
      };

    case GET_USER_LIST_FAIL:
      alert(`USER LIST LOADING FAIL: ${action.payload.error}`);
      return { ...state };

    case NEW_GROUP:
      return {
        ...state,
        group: action.payload,
      };

    case SEND_INVITE:
      // console.log(action.payload);
      if ('error' in action.payload) {
        alert(`INVITE FAIL: ${action.payload.error}`);
      } else {
        alert('USER_INVITED');
      }
      return { ...state };

    default:
      return state;
  }
}

export default newGroupReducer;
