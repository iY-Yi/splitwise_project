import axios from 'axios';
import { USER_SIGNUP_SUCCESS, USER_SIGNUP_FAIL } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const userSignup = (signupData) => (dispatch) => {
  axios.post('/user/signup', signupData)
    .then((Response) => dispatch({
      type: USER_SIGNUP_SUCCESS,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error.response.data);
      if (error.response && error.response.data) {
        return dispatch({
          type: USER_SIGNUP_FAIL,
          payload: error.response.data,
        });
      }
    });
};
