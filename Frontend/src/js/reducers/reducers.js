import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import profileReducer from './profileReducer';
// import signupReducer from './signupReducer';

export default combineReducers({
  login: loginReducer,
  profile: profileReducer,
});
