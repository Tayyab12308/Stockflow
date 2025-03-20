import { RECEIVE_CURRENT_USER } from '../actions/session_actions';
import { merge } from 'lodash';

interface Transaction {
  id: string;
};

export interface TransactionsState {
  [key: string]: Transaction;
};

interface ReceiveCurrentUserAction {
  type: typeof RECEIVE_CURRENT_USER;
  transactions: TransactionsState;
}

type SessionAction = ReceiveCurrentUserAction

const _nullState: TransactionsState = {}

const transactionReducer = (
  state: TransactionsState = _nullState,
  action: SessionAction
): TransactionsState => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return merge({}, state, action.transactions)
    default:
      return state;
  }
}

export default transactionReducer;
