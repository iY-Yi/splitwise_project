import axios from 'axios';
import {
  GET_DASHBOARD_SUCCESS, GET_DASHBOARD_FAIL, SETTLE_SUCCESS, SETTLE_FAIL,
} from './types';

export const getDashboard = (data) => (dispatch) => {
  // console.log(userId);
  axios.defaults.headers.common['authorization'] = data.token;
  axios.get('/dashboard', {
    params: {
      user: data.user,
    },
  })
    .then((Response) => dispatch({
      type: GET_DASHBOARD_SUCCESS,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: GET_DASHBOARD_FAIL,
          payload: error.response.data,
        });
      }
    });
};

export const settle = (data) => (dispatch) => {
  // console.log(userId);
  axios.defaults.headers.common['authorization'] = data.token;
  axios.post('/settle', data)
    .then((Response) => dispatch({
      type: SETTLE_SUCCESS,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: SETTLE_FAIL,
          payload: error.response.data,
        });
      }
    });
};
