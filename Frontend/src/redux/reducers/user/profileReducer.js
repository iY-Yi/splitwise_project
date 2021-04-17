import { GET_USER, UPDATE_USER } from '../../actions/types';

const initialState = {
  user: {},
};

function profileReducer(state = initialState, action) {
  // console.log(action.payload);
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.payload, // add user to state
      };
    case UPDATE_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

export default profileReducer;

// return Object.assign({}, state, {
//   books: state.books.concat(action.payload)
// });
