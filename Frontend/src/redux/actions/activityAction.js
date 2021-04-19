import axios from 'axios';
import {
  GET_ACTIVITY_SUCCESS, GET_ACTIVITY_FAIL,
} from './types';

export const getActivity = (userId) => (dispatch) => {
  console.log(userId);
  axios.get('/activity', {
    params: {
      user: userId,
    },
  })
    .then((Response) => dispatch({
      type: GET_ACTIVITY_SUCCESS,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: GET_ACTIVITY_FAIL,
          payload: error.response.data,
        });
      }
    });
};

