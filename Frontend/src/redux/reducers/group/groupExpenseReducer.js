import {
  GET_EXPENSE_SUCCESS, GET_EXPENSE_FAIL, ADD_EXPENSE_SUCCESS, ADD_EXPENSE_FAIL,
  ADD_COMMENT_SUCCESS, ADD_COMMENT_FAIL, DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAIL,
} from '../../actions/types';

const initialState = {
  expenses: [],
  balances: [],
  group: [],
  message: '',
};

function groupExpenseReducer(state = initialState, action) {
  // console.log(action.payload);
  switch (action.type) {
    case GET_EXPENSE_SUCCESS:
      return {
        ...state,
        group: action.payload.group, // add user to state
        balances: action.payload.balances,
        expenses: action.payload.expenses,
        message: '',
      };
    case GET_EXPENSE_FAIL:
      return {
        ...state,
        message: action.payload.error,
      };
    case ADD_EXPENSE_SUCCESS:
      return {
        ...state,
        message: '',
      };
    case ADD_EXPENSE_FAIL:
      alert(action.payload.error);
      return {
        ...state,
        message: action.payload.error,
      };
    case ADD_COMMENT_SUCCESS:
      // console.log(action.payload);
      return {
        ...state,
        expenses: action.payload.expenses,
        message: '',
      };
    case ADD_COMMENT_FAIL:
      alert(action.payload.error);
      return {
        ...state,
        message: action.payload.error,
      };
    case DELETE_COMMENT_SUCCESS:
      // console.log(action.payload);
      return {
        ...state,
        expenses: action.payload.expenses,
        message: '',
      };
    case DELETE_COMMENT_FAIL:
      alert(action.payload.error);
      return {
        ...state,
        message: action.payload.error,
      };
    default:
      return state;
  }
}

export default groupExpenseReducer;
