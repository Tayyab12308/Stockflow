import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../stock_actions';
import * as StockApiUtil from '../../util/stock_api_util';

export const {
  RECEIVE_STOCK,
  RECEIVE_STOCK_ERRORS,
  CLEAR_STOCK_ERRORS,
  RECEIVE_SEARCH,
} = actions;

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Mock the API utility functions
jest.mock('../../util/stock_api_util');

describe('stock actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
  });

  test('clearStockErrors returns the correct action', () => {
    const expectedAction = { type: CLEAR_STOCK_ERRORS };
    expect(actions.clearStockErrors()).toEqual(expectedAction);
  });

  test('fetchStocks dispatches RECEIVE_STOCK on successful API call', async () => {
    const mockPrices = { data: [1, 2, 3] };
    StockApiUtil.fetchPrices.mockResolvedValue(mockPrices);

    // Create a sample query for stocks
    const stockQuery = { ticker: 'AAPL', timeFrame: '1min', startDate: '2025-02-15', endDate: '2025-02-15' };

    await store.dispatch(actions.fetchStocks(stockQuery));

    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toEqual([
      { type: RECEIVE_STOCK, prices: mockPrices },
    ]);
    expect(StockApiUtil.fetchPrices).toHaveBeenCalledWith(stockQuery);
  });

  test('fetchStocks dispatches RECEIVE_STOCK_ERRORS on failed API call', async () => {
    const mockError = new Error('API error');
    mockError.status = 500;
    StockApiUtil.fetchPrices.mockRejectedValue(mockError);

    const stockQuery = { ticker: 'AAPL', timeFrame: '1min', startDate: '2025-02-15', endDate: '2025-02-15' };

    await store.dispatch(actions.fetchStocks(stockQuery));

    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toEqual([
      { type: RECEIVE_STOCK_ERRORS, errors: mockError },
    ]);
    expect(StockApiUtil.fetchPrices).toHaveBeenCalledWith(stockQuery);
  });

  test('searchStock dispatches RECEIVE_SEARCH on successful API call', async () => {
    const mockResults = [{ symbol: 'AAPL', name: 'Apple Inc.' }];
    StockApiUtil.searchStock.mockResolvedValue(mockResults);

    await store.dispatch(actions.searchStock('AAPL'));

    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toEqual([
      { type: RECEIVE_SEARCH, results: mockResults },
    ]);
    expect(StockApiUtil.searchStock).toHaveBeenCalledWith('AAPL');
  });
});
