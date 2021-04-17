import { USER_LOGIN, USER_LOGOUT, USER_SIGNUP } from '../../actions/types';

const initialState = {
  user: {},
};

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    case USER_SIGNUP:
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
