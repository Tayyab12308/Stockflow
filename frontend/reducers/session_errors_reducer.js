import { RECEIVE_SESSION_ERRORS, RECEIVE_CURRENT_USER, CLEAR_SESSION_ERRORS } from '../actions/session_actions';
import { merge } from 'lodash'

const _nullState = []
const sessionErrorsReducer = (state = _nullState, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_SESSION_ERRORS:
      return merge({}, state, action.errors);
    case RECEIVE_CURRENT_USER:
      return _nullState;
    case CLEAR_SESSION_ERRORS:
      return _nullState;
    default:
      return state;
  }
};

export default sessionErrorsReducer;