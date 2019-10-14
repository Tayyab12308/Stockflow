import { RECEIVE_SEARCH } from '../actions/stock_actions';
import { merge } from 'lodash';


const _nullState = {}

const searchReducer = (state = _nullState, action) => {
  Object.freeze(state)
  switch (action.type) {
    case RECEIVE_SEARCH:
      return  action.results.bestMatches;
    default: 
      return state;
  }
};

export default searchReducer;