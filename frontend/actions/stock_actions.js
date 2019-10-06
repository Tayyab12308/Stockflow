import * as StockApilUtil from '../util/stock_api_util';
import { RECEIVE_SESSION_ERRORS } from './session_actions';

export const RECEIVE_STOCK = "RECEIVE_STOCK";
export const RECEIVE_STOCK_ERRORS = "RECEIVE_STOCK_ERRORS";
export const CLEAR_STOCK_ERRORS = "CLEAR_STOCK_ERRORS";

const receiveStock = prices => ({
  type: RECEIVE_STOCK,
  prices,
});

const receiveStockErrors = errors => ({
  type: RECEIVE_SESSION_ERRORS,
  errors,
});

export const clearStockErrors = () => ({
  type: CLEAR_STOCK_ERRORS,
})

export const fetchStocks = ( symbol, range ) => dispatch => {
  StockApilUtil.fetchPrices(symbol, range)
  .then(prices => dispatch(receiveStock(prices)), error => dispatch(receiveStockErrors(error)))
};