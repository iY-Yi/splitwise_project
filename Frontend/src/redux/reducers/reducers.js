import { combineReducers } from 'redux';
import loginReducer from './user/loginReducer';
import groupsReducer from './group/groupsReducer';
import newGroupReducer from './group/newGroupReducer';
import groupExpenseReducer from './group/groupExpenseReducer';
import activityReducer from './dashboard/activityReducer';
import dashboardReducer from './dashboard/dashboardReducer';

export default combineReducers({
  login: loginReducer,
  groups: groupsReducer,
  newGroup: newGroupReducer,
  groupExpense: groupExpenseReducer,
  activity: activityReducer,
  dashboard: dashboardReducer,
});
