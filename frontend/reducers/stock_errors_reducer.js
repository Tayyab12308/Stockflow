import { RECEIVE_STOCK, RECEIVE_STOCK_ERRORS, CLEAR_STOCK_ERRORS } from '../actions/stock_actions';
import { merge } from 'lodash';


const _nullState = [];

const stockErrorsReducer = (state = _nullState, action) => {
  Object.freeze(state)
  switch (action.type) {
    case RECEIVE_STOCK_ERRORS: 
      return merge({}, state, action.errors);
    case RECEIVE_STOCK: 
      return _nullState;
    case CLEAR_STOCK_ERRORS:
      return _nullState
    default:
      return state;
  }
};

export default stockErrorsReducer;