import axios from 'axios';
import { USER_SIGNUP } from './types';

// eslint-disable-next-line import/prefer-default-export
export const userSignup = (signupData) => (dispatch) => {
  axios.post('/user/signup', signupData)
    .then((Response) => dispatch({
      type: USER_SIGNUP,
      payload: Response.data,
    }))
    .catch((error) => {
      if (error.response && error.response.data) {
        return dispatch({
          type: USER_SIGNUP,
          payload: error.response.data,
        });
      }
    });
};
