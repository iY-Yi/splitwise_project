import axios from 'axios';
// import cookie from 'react-cookies';
import {
  NEW_GROUP, GET_USER_LIST_SUCCESS, GET_USER_LIST_FAIL, SEND_INVITE,
} from '../types';

export const getUserList = () => (dispatch) => {
  axios.get('/group/userlist')
    .then((Response) => dispatch({
      type: GET_USER_LIST_SUCCESS,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: GET_USER_LIST_FAIL,
          payload: error.response.data,
        });
      }
    });
};

export const newGroup = (data) => (dispatch) => {
  // axios.defaults.headers.common.authorization = localStorage.getItem('token');
  axios.post('/group/new', data)
    .then((Response) => {
      // console.log(Response);
      dispatch({
        type: NEW_GROUP,
        payload: Response.data,
      });
    })
    .catch((error) => {
      // console.log(error.response);
      if (error.response && error.response.data) {
        return dispatch({
          type: NEW_GROUP,
          payload: error.response.data,
        });
      }
    });
};

export const sendInvite = (data) => (dispatch) => {
  // axios.defaults.headers.common.authorization = localStorage.getItem('token');
  axios.post('/group/invite', data)
    .then((Response) => {
      // console.log(Response);
      dispatch({
        type: SEND_INVITE,
        payload: Response.data,
      });
    })
    .catch((error) => {
      // console.log(error.response);
      if (error.response && error.response.data) {
        return dispatch({
          type: SEND_INVITE,
          payload: error.response.data,
        });
      }
    });
};
