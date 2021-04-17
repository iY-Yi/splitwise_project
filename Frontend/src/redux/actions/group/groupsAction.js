import axios from 'axios';
import cookie from 'react-cookies';
import { GET_GROUPS, LEAVE_GROUP } from '../types';

export const getGroups = () => (dispatch) => {
  axios.get('/group/all', {
    params: {
      user: cookie.load('id'),
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

export const leaveGroup = (updateData) => (dispatch) => {
  axios.defaults.headers.common.authorization = localStorage.getItem('token');
  axios.post('/user/update', updateData)
    .then((Response) => dispatch({
      type: LEAVE_GROUP,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: LEAVE_GROUP,
          payload: error.response.data,
        });
      }
    });
};
