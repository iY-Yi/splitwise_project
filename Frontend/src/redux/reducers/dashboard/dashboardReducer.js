import {
  GET_DASHBOARD_SUCCESS, GET_DASHBOARD_FAIL, SETTLE_SUCCESS, SETTLE_FAIL,
} from '../../actions/types';

const initialState = {
  owes: [],
  owed: [],
  details: [],
  message: '',
};

function dashboardReducer(state = initialState, action) {
  // console.log(action.payload);
  switch (action.type) {
    case GET_DASHBOARD_SUCCESS:
      return {
        ...state,
        owes: action.payload.owes, // add user to state
        owed: action.payload.owed,
        details: action.payload.details,
        message: '',
      };
    case GET_DASHBOARD_FAIL:
      return { ...state, message: action.payload.error };
    case SETTLE_SUCCESS:
      return {
        ...state,
        owes: action.payload.owes, // add user to state
        owed: action.payload.owed,
        details: action.payload.details,
        message: '',
      };
    case SETTLE_FAIL:
      alert(action.payload.error);
      return state;
    default:
      return state;
  }
}

export default dashboardReducer;
