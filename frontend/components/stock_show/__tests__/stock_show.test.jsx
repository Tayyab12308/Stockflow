import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import StockShow from '../stock_show';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Import and mock external functions and actions
import * as apiUtil from '../../../util/stock_api_util';
import * as util from '../../../util/util';
import * as sessionActions from '../../../actions/session_actions';
import userEvent from '@testing-library/user-event';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('../../../util/stock_api_util');
jest.mock('../../../util/util');
jest.mock('../../../actions/session_actions');

jest.mock('react-odometerjs', () => {
  return ({ value }) => <div data-testid="odometer">{value}</div>;
});

describe('StockShow component', () => {
  let store;
  let initialState;
  const mockUser = {
    id: 1,
    total_stock_count: { AAPL: 10 },
    funds: 10000,
    watchlist: [{ ticker_symbol: 'AAPL' }],
  };

  beforeEach(() => {
    initialState = {
      entities: {
        users: { 1: mockUser },
        stock: {},
      },
      errors: { session: {} },
    };
    store = mockStore(initialState);

    // Setup API util mocks
    apiUtil.fetchCompany.mockResolvedValue({ companyName: 'Apple Inc.' });
    apiUtil.fetchPrices.mockResolvedValue({
      AAPL: [
        { date: '2025-02-15 15:00:00', open: 144, high: 146, low: 143, close: 145, volume: 100001 },
        { date: '2025-02-15 15:01:00', open: 145, high: 148, low: 142, close: 147, volume: 100002 },
        { date: '2025-02-15 15:02:00', open: 146, high: 149, low: 141, close: 142, volume: 100003 },
        { date: '2025-02-15 15:03:00', open: 147, high: 150, low: 140, close: 144, volume: 100004 },
      ]
    })
    apiUtil.fetchKeyStats.mockResolvedValue({
      "Global Quote": {
        "03. high": 150,
        "04. low": 140,
        "02. open": 145,
        "06. volume": 1000000
      }
    });
    apiUtil.fetchCompanyProfile.mockResolvedValue([
      {
        ceo: 'Tim Cook',
        fullTimeEmployees: '100000',
        city: 'Cupertino',
        country: 'USA',
        mktCap: '2000000000000',
        volAvg: '5000000',
        description: 'Leading technology company.'
      }
    ]);
    apiUtil.fetchNews.mockResolvedValue({ articles: [{ title: 'News 1', source: { name: 'ABC' } }, { title: 'News 2', source: { name: 'XYZ' } }] });

    // Setup util mocks
    util.getTickerQuery.mockImplementation((ticker, range) => {
      switch (range) {
        case util.VALID_RANGES.ONE_DAY: return { ticker, range, value: '1D', timeFrame: "1min", startDate: '2025-02-15', endDate: '2025-02-15' };
        case util.VALID_RANGES.FIVE_DAYS: return { ticker, range, value: '1W', timeFrame: "5min", startDate: '2025-02-10', endDate: '2025-02-15' };
        case util.VALID_RANGES.ONE_MONTH: return { ticker, range, value: '1M', timeFrame: "15min", startDate: '2025-01-15', endDate: '2025-02-15' };
        case util.VALID_RANGES.THREE_MONTHS: return { ticker, range, value: '3M', timeFrame: "30min", startDate: '2025-11-15', endDate: '2025-02-15' };
        case util.VALID_RANGES.ONE_YEAR: return { ticker, range, value: '1Y', timeFrame: "1hour", startDate: '2024-02-15', endDate: '2025-02-15' };
        case util.VALID_RANGES.FIVE_YEARS: return { ticker, range, value: '5Y', timeFrame: "4hour", startDate: '2020-02-15', endDate: '2025-02-15' };
        default: return { ticker, range, value: '1D', timeFrame: "1min", startDate: '2025-02-15', endDate: '2025-02-15' };
      }
    })
    util.transformFinModelPrepRawData.mockReturnValue([
      { date: '2025-02-15', time: '15:00:00', price: 145 }
    ]);
    util.fetchValidPricesForTicker.mockResolvedValue([
      { AAPL: [{ date: '2025-02-15 15:00:00', open: 144, high: 146, low: 143, close: 145, volume: 100000 }] }
    ]);

    // Setup session actions mocks
    sessionActions.addToWatchlist.mockImplementation(() => {
      return () => Promise.resolve({});
    });
    sessionActions.deleteFromWatchlist.mockImplementation(() => {
      return () => Promise.resolve({});
    });
    sessionActions.createTransaction.mockImplementation(() => {
      return () => Promise.resolve({});
    });
  });

  const renderComponentWithParams = (params) => {
    return render(
      <Provider store={params}>
        <MemoryRouter initialEntries={['/stock/AAPL']}>
          <Routes>
            <Route path="/stock/:ticker" element={<StockShow />}>
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  }

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/stock/AAPL']}>
          <Routes>
            <Route path="/stock/:ticker" element={<StockShow />}>
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  test('renders company info and stock graph', async () => {
    renderComponent();

    await waitFor(() =>
      expect(apiUtil.fetchCompany).toHaveBeenCalledWith('AAPL')
    );

    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("$145.00")).toBeInTheDocument()
    );
  });

  test('renders range buttons and responds to clicks', async () => {
    renderComponent();

    const buttons = await screen.findByRole('button', { name: "1D" });

    expect(buttons).toBeInTheDocument();
    userEvent.click(buttons[0]);

    expect(util.getTickerQuery).toHaveBeenCalled();
  });

  test('calculates order total when shares input changes', async () => {
    renderComponent();

    const sharesInput = await screen.findByPlaceholderText('0');

    await userEvent.clear(sharesInput);
    await userEvent.type(sharesInput, '5');

    await waitFor(() =>
      expect(screen.getByText("$725.00")).toBeInTheDocument()
    );
  });

  test('renders watchlist button correctly and handles click', async () => {
    renderComponent();

    const watchlistButton = await screen.findByRole('button', { name: "Remove From Watchlist" });
    expect(watchlistButton).toBeInTheDocument();

    await userEvent.click(watchlistButton);

    const errorMessage = await screen.findByText("It is not recommended to remove a stock you are currently invested in from your watchlist. If you would still like to remove AAPL from your watchlist please push the button one more time");
    expect(errorMessage).toBeInTheDocument();

    await userEvent.click(watchlistButton);

    await waitFor(() => {
      expect(sessionActions.deleteFromWatchlist).toHaveBeenCalledTimes(1);
    });
  });

  test('handles buy order submission and shows success message', async () => {
    renderComponent();

    const sharesInput = await screen.findByPlaceholderText('0');
    await userEvent.type(sharesInput, '5');

    const submitButton = await screen.findByRole('button', { name: "Place Buy Order" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(sessionActions.createTransaction).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Congratulations! You just bought 5 shares of AAPL")).toBeInTheDocument();
    });
  });

  test('renders error if shares input is empty on order submission', async () => {
    renderComponent();

    const submitButton = await screen.findByRole('button', { name: "Place Buy Order" });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Please enter a valid number of shares")).toBeInTheDocument();
    });
  });

  test('handles add to watchlist action', async () => {
    const modifiedUser = {
      ...mockUser,
      watchlist: []  // no stocks in watchlist
    };
    const modifiedInitialState = {
      entities: {
        users: { 1: modifiedUser },
        stock: {},
      },
      errors: { session: {} },
    };
    const modifiedStore = mockStore(modifiedInitialState);

    renderComponentWithParams(modifiedStore);

    const addButton = await screen.findByRole('button', { name: "Add to Watchlist" });
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);

    await waitFor(() => {
      expect(sessionActions.addToWatchlist).toHaveBeenCalled();
    });
  });

  test('adds stock to watchlist after buy action if stock is not already in watchlist', async () => {
    const modifiedUser = {
      ...mockUser,
      watchlist: []  // no stocks in watchlist
    };
    const modifiedInitialState = {
      entities: {
        users: { 1: modifiedUser },
        stock: {},
      },
      errors: { session: {} },
    };
    const modifiedStore = mockStore(modifiedInitialState);

    renderComponentWithParams(modifiedStore);

    const addButton = await screen.findByRole('button', { name: "Add to Watchlist" });
    expect(addButton).toBeInTheDocument();

    const sharesInput = await screen.findByPlaceholderText('0');
    await userEvent.type(sharesInput, '5');

    const submitButton = await screen.findByRole('button', { name: "Place Buy Order" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(sessionActions.createTransaction).toHaveBeenCalled();
    });

    const addedToWatchlistMessage = await screen.findByText("This stock has automatically been added to your watchlist so you can easily track changes in price");
    expect(addedToWatchlistMessage).toBeInTheDocument();

    await waitFor(() => {
      expect(sessionActions.addToWatchlist).toHaveBeenCalled();
    });
  });

  test('clicking through different ranges is handled properly', async () => {
    renderComponent();

    const rangeKeys = Object.keys(util.VALID_RANGES);

    for (const key of rangeKeys) {
      const rangeValue = util.VALID_RANGES[key];

      const expectedQuery = util.getTickerQuery('AAPL', rangeValue);

      const buttons = await screen.findAllByRole('button', { name: expectedQuery.value });
      expect(buttons.length).toBeGreaterThan(0);
      const button = buttons[0];

      util.getTickerQuery.mockClear();

      await userEvent.click(button);

      await waitFor(() => {
        expect(util.getTickerQuery).toHaveBeenCalledWith('AAPL', rangeValue);
      });
    }
  });

  test('handles sell action properly', async () => {
    renderComponent();

    const sellButton = await screen.findByRole('button', { name: "Sell AAPL" });
    await userEvent.click(sellButton);

    const sharesInput = await screen.findByPlaceholderText('0');
    await userEvent.clear(sharesInput);
    await userEvent.type(sharesInput, '5');

    const submitButton = await screen.findByRole('button', { name: "Place Sell Order" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(sessionActions.createTransaction).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Congratulations! You just sold 5 shares of AAPL")).toBeInTheDocument();
    });
  });

  test('renders error if user tries to sell more shares than they have', async () => {
    renderComponent();

    const sellButton = await screen.findByRole('button', { name: "Sell AAPL" });
    await userEvent.click(sellButton);

    const sharesInput = await screen.findByPlaceholderText('0');
    await userEvent.clear(sharesInput);
    await userEvent.type(sharesInput, '11');

    const submitButton = await screen.findByRole('button', { name: "Place Sell Order" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("You don't have enough enough shares of AAPL to complete this order. Please buy some more shares.")).toBeInTheDocument();
    });
  });

  test('renders error if user tries to buy more shares than they have buying power for', async () => {
    renderComponent();

    const buyButton = await screen.findByRole('button', { name: "Buy AAPL" });
    await userEvent.click(buyButton);

    const sharesInput = await screen.findByPlaceholderText('0');
    await userEvent.clear(sharesInput);
    await userEvent.type(sharesInput, '110000000');

    const submitButton = await screen.findByRole('button', { name: "Place Buy Order" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("You don't have enough buying power to buy 110000000 shares of AAPL.")).toBeInTheDocument();
    });
  });

  test('Visiting a stock page that you are not invested in shows that you have 0 shares in that stock', async () => {
    const userWithoutShares = {
      ...mockUser,
      total_stock_count: {} // No entry for AAPL
    };

    const customInitialState = {
      entities: {
        users: { 1: userWithoutShares },
        stock: {},
      },
      errors: { session: {} },
    };

    const customStore = mockStore(customInitialState);

    renderComponentWithParams(customStore);

    const sellButton = await screen.findByRole('button', { name: "Sell AAPL" });
    await userEvent.click(sellButton);

    await waitFor(() => {
      const odometer = screen.getAllByTestId('odometer');
      expect(odometer[odometer.length - 1]).toHaveTextContent("0");
    });
  });

  test('entering a non-numerical value does not update shares field', async () => {
    renderComponent();

    const buyButton = await screen.findByRole('button', { name: "Buy AAPL" });
    await userEvent.click(buyButton);

    const sharesInput = await screen.findByPlaceholderText('0');
    await userEvent.clear(sharesInput);
    await userEvent.type(sharesInput, 'k');

    await waitFor(() => {
      expect(sharesInput).toHaveTextContent("");
    });
  });
});