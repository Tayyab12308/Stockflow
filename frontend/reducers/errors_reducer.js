import { combineReducers } from 'redux'
import sessionErrorsReducer from './session_errors_reducer';
import stockErrorsReducer from './stock_errors_reducer';

const errorsReducer = combineReducers({
  session: sessionErrorsReducer,
  stock: stockErrorsReducer,
});

export default errorsReducer;