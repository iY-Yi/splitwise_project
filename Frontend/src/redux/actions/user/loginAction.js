import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT } from '../types';

export const userLogin = (loginData) => (dispatch) => {
  axios.defaults.withCredentials = true;
  axios.post('/user/login', loginData)
    .then((Response) => {
      console.log(Response.data);
      const { token } = Response.data;
      localStorage.setItem('token', token);

      // console.log(decoded);
      return dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: Response.data,
      });
    })
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: USER_LOGIN_FAIL,
          payload: error.response.data,
        });
      }
    });
};

export const userLogout = () => (dispatch) => dispatch({ type: USER_LOGOUT });
