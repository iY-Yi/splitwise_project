import axios from 'axios';
import cookie from 'react-cookies';
import {
  GET_GROUPS, LEAVE_GROUP_SUCCESS, LEAVE_GROUP_FAIL, ACCEPT_INVITE_SUCCESS, ACCEPT_INVITE_FAIL,
} from '../types';

export const getGroups = (userId) => (dispatch) => {
  axios.get('/group/all', {
    params: {
      user: userId,
    },
  })
    .then((Response) => dispatch({
      type: GET_GROUPS,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: GET_GROUPS,
          payload: error.response.data,
        });
      }
    });
};

export const leaveGroup = (data) => (dispatch) => {
  // axios.defaults.headers.common.authorization = localStorage.getItem('token');
  axios.post('/group/leave', data)
    .then((Response) => {
      // console.log(Response);
      dispatch({
        type: LEAVE_GROUP_SUCCESS,
        payload: Response.data,
      });
    })
    .catch((error) => {
      // console.log(error.response);
      if (error.response && error.response.data) {
        return dispatch({
          type: LEAVE_GROUP_FAIL,
          payload: error.response.data,
        });
      }
    });
};

export const acceptInvite = (data) => (dispatch) => {
  console.log(data);
  // axios.defaults.headers.common.authorization = localStorage.getItem('token');
  axios.post('/group/accept', data)
    .then((Response) => {
      console.log(Response);
      dispatch({
        type: ACCEPT_INVITE_SUCCESS,
        payload: Response.data,
      });
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response && error.response.data) {
        return dispatch({
          type: ACCEPT_INVITE_FAIL,
          payload: error.response.data,
        });
      }
    });
};
