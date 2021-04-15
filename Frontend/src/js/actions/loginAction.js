import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { USER_LOGIN, USER_LOGOUT } from './types';

export const userLogin = (loginData) => (dispatch) => {
  axios.defaults.withCredentials = true;
  axios.post('/user/login', loginData)
    .then((Response) => {
      // console.log(Response.data);
      const { token } = Response.data;
      localStorage.setItem('token', token);
      const decoded = jwt_decode(token.split(' ')[1]);
      localStorage.setItem('userId', decoded._id);
      localStorage.setItem('userName', decoded.name);
      // console.log(decoded);
      return dispatch({
        type: USER_LOGIN,
        payload: Response.data.user,
      });
    })
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: USER_LOGIN,
          payload: error.response.data,
        });
      }
    });
};

export const userLogout = () => (dispatch) => dispatch({ type: USER_LOGOUT });
