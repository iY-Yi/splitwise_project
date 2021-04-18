import axios from 'axios';
// import cookie from 'react-cookies';
import { GET_USER, UPDATE_USER } from '../types';

// export const getUser = () => (dispatch) => {
//   const id = cookie.load('id');
//   axios.defaults.headers.common.authorization = localStorage.getItem('token');
//   axios.get(`/user/profile/${id}`)
//     .then((Response) => dispatch({
//       type: GET_USER,
//       payload: Response.data,
//     }))
//     .catch((error) => {
//       console.log(error);
//       if (error.response && error.response.data) {
//         return dispatch({
//           type: GET_USER,
//           payload: error.response.data,
//         });
//       }
//     });
// };

export const updateUser = (updateData) => (dispatch) => {
  axios.defaults.headers.common.authorization = localStorage.getItem('token');
  axios.post('/user/update', updateData)
    .then((Response) => dispatch({
      type: UPDATE_USER,
      payload: Response.data,
    }))
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        return dispatch({
          type: UPDATE_USER,
          payload: error.response.data,
        });
      }
    });
};
