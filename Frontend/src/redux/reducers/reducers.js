import { combineReducers } from 'redux';
import loginReducer from './user/loginReducer';
import profileReducer from './user/profileReducer';
import groupsReducer from './group/groupsReducer';
import newGroupReducer from './group/newGroupReducer';

export default combineReducers({
  login: loginReducer,
  profile: profileReducer,
  groups: groupsReducer,
  newGroup: newGroupReducer,
});
