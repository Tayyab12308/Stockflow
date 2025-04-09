import { RECEIVE_SESSION_ERRORS, RECEIVE_CURRENT_USER, CLEAR_SESSION_ERRORS } from '../actions/session_actions';

interface ReceiveSessionErrorsAction {
  type: typeof RECEIVE_SESSION_ERRORS;
  errors: string[];
}

interface ReceiveCurrentUserAction {
  type: typeof RECEIVE_CURRENT_USER;
}

interface ClearSessionErrorsAction {
  type: typeof CLEAR_SESSION_ERRORS;
}

type SessionAction = ReceiveSessionErrorsAction | ReceiveCurrentUserAction | ClearSessionErrorsAction;


const _nullState: string[] = [];

const sessionErrorsReducer = (
  state: string[] = _nullState,
  action: SessionAction
): string[] => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_SESSION_ERRORS:
      return action.errors;
    case RECEIVE_CURRENT_USER:
    case CLEAR_SESSION_ERRORS:
      return _nullState;
    default:
      return state;
  }
};

export default sessionErrorsReducer;