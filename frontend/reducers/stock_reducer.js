import { RECEIVE_STOCK } from '../actions/stock_actions';
import { merge } from 'lodash';

const _nullState = {};

const stockReducer = (state = _nullState, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_STOCK:
      return merge({}, state, action.prices)
    default:
      return state;
  }
};

export default stockReducer;