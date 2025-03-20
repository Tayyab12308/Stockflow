import { RECEIVE_CURRENT_USER, LOGOUT_CURRENT_USER } from '../actions/session_actions';
import { BackendUser } from '../interfaces';
import { SessionState } from './root_reducer';

interface ReceiveCurrentUserAction {
  type: typeof RECEIVE_CURRENT_USER;
  user: BackendUser;
}

interface LogoutCurrentUserAction {
  type: typeof LOGOUT_CURRENT_USER;
}

type SessionAction = ReceiveCurrentUserAction | LogoutCurrentUserAction;

const _nullSession: SessionState = {
  id: null,
}
const sessionReducer = (
  state: SessionState = _nullSession,
  action: SessionAction
): SessionState => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return { id: action.user.id };
    case LOGOUT_CURRENT_USER:
      return _nullSession;
    default:
      return state;
  }
};

export default sessionReducer;