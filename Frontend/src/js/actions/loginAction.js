import axios from 'axios';
import { USER_LOGIN, USER_LOGOUT } from './types';

export const userLogin = (loginData) => (dispatch) => {
  axios.defaults.withCredentials = true;
  axios.post('/user/login', loginData)
    .then((Response) => dispatch({
      type: USER_LOGIN,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error.response);
      if (error.response && error.response.data) {
        return dispatch({
          type: USER_LOGIN,
          payload: error.response.data,
        });
      }
    });
};

export const userLogout = () => (dispatch) => dispatch({ type: USER_LOGOUT });
