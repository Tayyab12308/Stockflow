import { RECEIVE_CURRENT_USER } from '../actions/session_actions';
import { merge } from 'lodash';

interface WatchlistItem {
  id: string;
}

export interface WatchlistState {
  [key: string]: WatchlistItem;
}

interface ReceiveCurrentUserAction {
  type: typeof RECEIVE_CURRENT_USER;
  watchlist: WatchlistState;
}

type SessionAction = ReceiveCurrentUserAction

const _nullState: WatchlistState = {};

const watchlistReducer = (
  state: WatchlistState = _nullState,
  action: SessionAction
): WatchlistState => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return merge({}, state, action.watchlist)
    default:
      return state;
  }
};

export default watchlistReducer;