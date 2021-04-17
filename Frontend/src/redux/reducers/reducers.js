import { combineReducers } from 'redux';
import loginReducer from './user/loginReducer';
import profileReducer from './user/profileReducer';

export default combineReducers({
  login: loginReducer,
  profile: profileReducer,
});
