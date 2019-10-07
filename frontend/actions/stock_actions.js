import * as StockApilUtil from '../util/stock_api_util';

export const RECEIVE_STOCK = "RECEIVE_STOCK";
export const RECEIVE_STOCK_ERRORS = "RECEIVE_STOCK_ERRORS";
export const CLEAR_STOCK_ERRORS = "CLEAR_STOCK_ERRORS";
export const RECEIVE_SEARCH = "RECEIVE_SEARCH";

const receiveStock = prices => ({
  type: RECEIVE_STOCK,
  prices,
});

const receiveSearch = results => ({
  type: RECEIVE_SEARCH,
  results,
});

const receiveStockErrors = errors => ({
  type: RECEIVE_STOCK_ERRORS,
  errors,
});

export const clearStockErrors = () => ({
  type: CLEAR_STOCK_ERRORS,
})

export const fetchStocks = ( symbol, range ) => dispatch => {
  StockApilUtil.fetchPrices(symbol, range)
  .then(prices => dispatch(receiveStock(prices)), error => dispatch(receiveStockErrors(error)))
};

export const searchStock = string => dispatch => {
  StockApilUtil.searchStock(string)
  .then(results => dispatch(receiveSearch(results)))
};