import axios from 'axios';
import {
  GET_EXPENSE_SUCCESS, GET_EXPENSE_FAIL, ADD_EXPENSE_SUCCESS, ADD_EXPENSE_FAIL,
  ADD_COMMENT_SUCCESS, ADD_COMMENT_FAIL, DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAIL,
} from '../types';

export const getExpense = (data) => (dispatch) => {
  // console.log(data);
  axios.get(`/group/expense/${data.groupId}`, {
    params: {
      // timezone: timezone,
      user: data.userId,
    },
  })
    .then((Response) => dispatch({
      type: GET_EXPENSE_SUCCESS,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: GET_EXPENSE_FAIL,
          payload: error.response.data,
        });
      }
    });
};

export const addExpense = (data) => (dispatch) => {
  // console.log(data);
  axios.post('/group/expense/add', data)
    .then((Response) => dispatch({
      type: ADD_EXPENSE_SUCCESS,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: ADD_EXPENSE_FAIL,
          payload: error.response.data,
        });
      }
    });
};

export const addComment = (data) => (dispatch) => {
  // console.log(data);
  axios.post('/group/expense/addComment', data)
    .then((Response) => dispatch({
      type: ADD_COMMENT_SUCCESS,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: ADD_COMMENT_FAIL,
          payload: error.response.data,
        });
      }
    });
};

export const deleteComment = (data) => (dispatch) => {
  // console.log(data);
  axios.post('/group/expense/deleteComment', data)
    .then((Response) => dispatch({
      type: DELETE_COMMENT_SUCCESS,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: DELETE_COMMENT_FAIL,
          payload: error.response.data,
        });
      }
    });
};
