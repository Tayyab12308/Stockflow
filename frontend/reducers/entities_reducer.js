import { combineReducers } from 'redux';
import usersReducer from './users_reducer';
import stockReducer from './stock_reducer';
import searchReducer from './search_reducer'

const entitiesReducer = combineReducers({
  users: usersReducer,
  stock: stockReducer,
  search: searchReducer,
});

export default entitiesReducer;