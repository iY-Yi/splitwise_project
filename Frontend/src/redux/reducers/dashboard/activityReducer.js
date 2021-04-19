import {
  GET_ACTIVITY_SUCCESS, GET_ACTIVITY_FAIL
} from '../../actions/types';

const initialState = {
  groups: [],
  activities: [],
  message: '',
};

function activityReducer(state = initialState, action) {
  // console.log(action.payload);
  switch (action.type) {
    case GET_ACTIVITY_SUCCESS:
      return {
        ...state,
        groups: action.payload.groups, // add user to state
        activities: action.payload.activities,
        message: '',
      };
    case GET_ACTIVITY_FAIL:
      return { ...state, message: action.payload.error };
    default:
      return state;
  }
}

export default activityReducer;
