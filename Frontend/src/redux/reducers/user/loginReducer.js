import {
  USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT, USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL, UPDATE_USER,
} from '../../actions/types';

const initialState = {
  user: {},
  token: '',
};

function loginReducer(state = initialState, action) {
  switch (action.type) {
    // user sign up/login
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case USER_LOGIN_FAIL:
      alert(`LOGIN FAIL: ${action.payload.error}`);
      return { ...state };
    case USER_SIGNUP_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };

    case USER_SIGNUP_FAIL:
      alert(`LOGIN FAIL: ${action.payload.error}`);
      return { ...state };
    // profile page
    // case GET_USER:
    //   return {
    //     ...state,
    //     user: action.payload, // add user to state
    //   };
    case UPDATE_USER:
      return {
        ...state,
        user: action.payload,
      };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
}

export default loginReducer;

// return Object.assign({}, state, {
//   books: state.books.concat(action.payload)
// });
