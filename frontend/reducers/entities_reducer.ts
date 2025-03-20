import { combineReducers } from 'redux';
import usersReducer, { ReceiveCurrentUserAction } from './users_reducer';
import { SessionState } from './root_reducer';

const entitiesReducer = combineReducers({
  users: usersReducer,
});

export default entitiesReducer;