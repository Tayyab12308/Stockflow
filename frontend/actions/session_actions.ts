import * as APIUtil from '../util/session_api_util';
import * as WatchlistAPIUtil from '../util/watchlist_api_util';
import * as TransactionAPIUtil from '../util/transaction_api_util';
import { AxiosResponse } from 'axios';
import {
  User,
  UserSessionDetails,
  BackendUser,
  WatchlistParams,
  TransactionParams
} from '../interfaces';
import { AppDispatch } from '../store';


export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const LOGOUT_CURRENT_USER = "LOGOUT_CURRENT_USER";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";
export const CLEAR_SESSION_ERRORS = "CLEAR_SESSION_ERRORS";

const receiveCurrentUser = (user: BackendUser) => ({
  type: RECEIVE_CURRENT_USER,
  user,
});

const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER,
});

const receiveSessionErrors = (errors: BackendErrorResponse) => ({
  type: RECEIVE_SESSION_ERRORS,
  errors,
});

export const clearSessionErrors = () => ({
  type: CLEAR_SESSION_ERRORS,
});

export const login = (user: UserSessionDetails) => async (dispatch: AppDispatch): Promise<void> => {
  try {
    const response: AxiosResponse<any, any> = await APIUtil.login(user);
    dispatch(receiveCurrentUser(response.data.user));
  } catch (error: any) {
    console.log({ error })
    dispatch(receiveSessionErrors(error.response.data));
  }
};

export const addToWatchlist = (watchlist: WatchlistParams) => async (dispatch: AppDispatch) => {
  try {
    const response: AxiosResponse<any, any> = await WatchlistAPIUtil.addToWatchlist(watchlist);
    dispatch(receiveCurrentUser(response.data.user));
  } catch (error: any) {
    dispatch(receiveSessionErrors(error.response.data))
  }
};

export const deleteFromWatchlist = (watchlist: WatchlistParams) => async (dispatch: AppDispatch) => {
  try {
    const response: AxiosResponse<any, any> = await WatchlistAPIUtil.deleteFromWatchlist(watchlist);
    dispatch(receiveCurrentUser(response.data.user));
  } catch (error: any) {
    dispatch(receiveSessionErrors(error.response.data));
  }
};

export const createTransaction = (transaction: TransactionParams) => async (dispatch: AppDispatch) => {
  try {
    const response: AxiosResponse<any, any> = await TransactionAPIUtil.createTransaction(transaction);
    dispatch(receiveCurrentUser(response.data.user));
  } catch (error: any) {
    dispatch(receiveSessionErrors(error.response.data));
  }
};

export const logout = () => async (dispatch: AppDispatch) => {
  try {
    await APIUtil.logout();
    dispatch(logoutCurrentUser());
  } catch (error: any) {
    dispatch(receiveSessionErrors(error.response.data));
  }
};

export const signup = (user: User) => async (dispatch: AppDispatch): Promise<void> => {
  try {
    const response: AxiosResponse<any, any> = await APIUtil.signup(user);
    dispatch(receiveCurrentUser(response.data.user));
  } catch (error: any) {
    dispatch(receiveSessionErrors(error.response.data));
  }
};
