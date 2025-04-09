import { RECEIVE_CURRENT_USER } from '../actions/session_actions';
import { merge} from 'lodash';
import { BackendUser, User } from '../interfaces';
import { convertKeysToCamelCase } from '../util/util';

export interface ReceiveCurrentUserAction {
  type: typeof RECEIVE_CURRENT_USER;
  user: BackendUser;
}

export interface UsersState {
  [key: string]: User;
}

type SessionAction = ReceiveCurrentUserAction;

const usersReducer = (
  state: UsersState = {},
  action: SessionAction
): UsersState => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      const camelUser = convertKeysToCamelCase(action.user) as User;
      return merge({}, {[camelUser.id]: camelUser });
    default:
      return state;
  }
};

export default usersReducer;