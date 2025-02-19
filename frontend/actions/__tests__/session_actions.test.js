import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as sessionActions from '../session_actions';
import * as APIUtil from '../../util/session_api_util';
import * as WatchlistAPIUtil from '../../util/watchlist_api_util';
import * as TransactionAPIUtil from '../../util/transaction_api_util';

const {
  RECEIVE_CURRENT_USER,
  LOGOUT_CURRENT_USER,
  RECEIVE_SESSION_ERRORS,
  CLEAR_SESSION_ERRORS,
} = sessionActions;

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Session Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
  });

  test('clearSessionErrors returns the correct action', () => {
    const expectedAction = { type: CLEAR_SESSION_ERRORS };
    expect(sessionActions.clearSessionErrors()).toEqual(expectedAction);
  });

  test('login dispatches RECEIVE_CURRENT_USER on successful API call', async () => {
    const user = { id: 1, name: 'Test User' };
    APIUtil.login = jest.fn().mockResolvedValue({ user });
    
    await store.dispatch(sessionActions.login({ email: 'test@test.com', password: 'password' }));
    
    const actionsDispatched = store.getActions();
    expect(actionsDispatched).toContainEqual({
      type: RECEIVE_CURRENT_USER,
      user,
    });
    expect(APIUtil.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
  });

  test('login dispatches RECEIVE_SESSION_ERRORS on failed API call', async () => {
    const errorResponse = { responseJSON: { error: 'Invalid credentials' } };
    APIUtil.login = jest.fn().mockRejectedValue(errorResponse);
    
    await store.dispatch(sessionActions.login({ email: 'test@test.com', password: 'wrong' }));
    
    const actionsDispatched = store.getActions();
    expect(actionsDispatched).toContainEqual({
      type: RECEIVE_SESSION_ERRORS,
      errors: errorResponse.responseJSON,
    });
  });

  test('addToWatchlist dispatches RECEIVE_CURRENT_USER on success', async () => {
    const user = { id: 1, name: 'Test User', watchlist: [{ ticker_symbol: 'AAPL' }] };
    WatchlistAPIUtil.addToWatchlist = jest.fn().mockResolvedValue({ user });
    
    await store.dispatch(sessionActions.addToWatchlist({ ticker_symbol: 'AAPL' }));
    
    const actionsDispatched = store.getActions();
    expect(actionsDispatched).toContainEqual({
      type: RECEIVE_CURRENT_USER,
      user,
    });
    expect(WatchlistAPIUtil.addToWatchlist).toHaveBeenCalledWith({ ticker_symbol: 'AAPL' });
  });

  test('addToWatchlist dispatches RECEIVE_SESSION_ERRORS on failure', async () => {
    const errorResponse = { responseJSON: { error: 'Add failed' } };
    WatchlistAPIUtil.addToWatchlist = jest.fn().mockRejectedValue(errorResponse);
    
    await store.dispatch(sessionActions.addToWatchlist({ ticker_symbol: 'AAPL' }));
    
    const actionsDispatched = store.getActions();
    expect(actionsDispatched).toContainEqual({
      type: RECEIVE_SESSION_ERRORS,
      errors: errorResponse.responseJSON,
    });
  });

  test('deleteFromWatchlist dispatches RECEIVE_CURRENT_USER on success', async () => {
    const user = { id: 1, name: 'Test User', watchlist: [] };
    WatchlistAPIUtil.deleteFromWatchlist = jest.fn().mockResolvedValue({ user });
    
    await store.dispatch(sessionActions.deleteFromWatchlist({ ticker_symbol: 'AAPL' }));
    
    const actionsDispatched = store.getActions();
    expect(actionsDispatched).toContainEqual({
      type: RECEIVE_CURRENT_USER,
      user,
    });
    expect(WatchlistAPIUtil.deleteFromWatchlist).toHaveBeenCalledWith({ ticker_symbol: 'AAPL' });
  });

  test('deleteFromWatchlist dispatches RECEIVE_SESSION_ERRORS on failure', async () => {
    const errorResponse = { responseJSON: { error: 'Delete failed' } };
    WatchlistAPIUtil.deleteFromWatchlist = jest.fn().mockRejectedValue(errorResponse);
    
    await store.dispatch(sessionActions.deleteFromWatchlist({ ticker_symbol: 'AAPL' }));
    
    const actionsDispatched = store.getActions();
    expect(actionsDispatched).toContainEqual({
      type: RECEIVE_SESSION_ERRORS,
      errors: errorResponse.responseJSON,
    });
  });

  test('createTransaction dispatches RECEIVE_CURRENT_USER on success', async () => {
    const user = { id: 1, name: 'Test User', transactions: [] };
    TransactionAPIUtil.createTransaction = jest.fn().mockResolvedValue({ user });
    
    await store.dispatch(sessionActions.createTransaction({
      ticker_symbol: 'AAPL',
      transaction_amount: 100,
      stock_count: 1,
      transaction_type: 'BUY',
    }));
    
    const actionsDispatched = store.getActions();
    expect(actionsDispatched).toContainEqual({
      type: RECEIVE_CURRENT_USER,
      user,
    });
    expect(TransactionAPIUtil.createTransaction).toHaveBeenCalledWith({
      ticker_symbol: 'AAPL',
      transaction_amount: 100,
      stock_count: 1,
      transaction_type: 'BUY',
    });
  });

  test('createTransaction dispatches RECEIVE_SESSION_ERRORS on failure', async () => {
    const errorResponse = { responseJSON: { error: 'Transaction failed' } };
    TransactionAPIUtil.createTransaction = jest.fn().mockRejectedValue(errorResponse);
    
    await store.dispatch(sessionActions.createTransaction({
      ticker_symbol: 'AAPL',
      transaction_amount: 100,
      stock_count: 1,
      transaction_type: 'BUY',
    }));
    
    const actionsDispatched = store.getActions();
    expect(actionsDispatched).toContainEqual({
      type: RECEIVE_SESSION_ERRORS,
      errors: errorResponse.responseJSON,
    });
  });

  test('logout dispatches LOGOUT_CURRENT_USER on successful API call', async () => {
    APIUtil.logout = jest.fn().mockResolvedValue({});
    
    await store.dispatch(sessionActions.logout());
    
    const actionsDispatched = store.getActions();
    expect(actionsDispatched).toContainEqual({ type: LOGOUT_CURRENT_USER });
    expect(APIUtil.logout).toHaveBeenCalled();
  });

  test('signup dispatches RECEIVE_CURRENT_USER on successful API call', async () => {
    const user = { id: 1, name: 'Test User' };
    APIUtil.signup = jest.fn().mockResolvedValue({ user });
    
    await store.dispatch(sessionActions.signup({ email: 'test@test.com', password: 'password' }));
    
    const actionsDispatched = store.getActions();
    expect(actionsDispatched).toContainEqual({
      type: RECEIVE_CURRENT_USER,
      user,
    });
    expect(APIUtil.signup).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
  });

  test('signup dispatches RECEIVE_SESSION_ERRORS on failure', async () => {
    const errorResponse = { responseJSON: { error: 'Signup failed' } };
    APIUtil.signup = jest.fn().mockRejectedValue(errorResponse);
    
    await store.dispatch(sessionActions.signup({ email: 'test@test.com', password: 'password' }));
    
    const actionsDispatched = store.getActions();
    expect(actionsDispatched).toContainEqual({
      type: RECEIVE_SESSION_ERRORS,
      errors: errorResponse.responseJSON,
    });
  });
});