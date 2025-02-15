import { RECEIVE_STOCK } from '../actions/stock_actions';

const _nullState = {};

const stockReducer = (state = _nullState, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_STOCK:
      return action.prices;
    default:
      return state;
  }
};

export default stockReducer;