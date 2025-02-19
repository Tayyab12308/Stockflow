import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from '../dashboard';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import moment from 'moment';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-odometerjs', () => {
  return ({ value }) => <div data-testid="odometer">{value}</div>;
});

jest.mock('../../../util/stock_api_util', () => ({
  fetchAllNews: jest.fn(),

}));
jest.mock('../../../util/util', () => ({
  fetchValidPricesForTicker: jest.fn(),
  transformFinModelPrepRawData: jest.fn(),
  VALID_RANGES: {
    ONE_DAY: "1D",
    FIVE_DAYS: "5D",
    ONE_MONTH: "1M",
    THREE_MONTHS: "3M",
    ONE_YEAR: "1Y",
    FIVE_YEARS: "5Y"
  },
}));

const samplePriceData = [
  { date: '2025-02-15 15:00:00', open: 144, high: 146, low: 143, close: 145, volume: 100000 }
];
const transformedPriceData = samplePriceData

  .reverse()
  .map((item, idx) => {
    const [datePart, timePart] = item.date.split(" ");
    return {
      date: datePart,
      time: timePart,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      price: item.close,
      idx,
    };
  });

const portfolio = {
  "1": {
    total_stock_count: { AAPL: 10, GOOG: 5 },
    portfolio_value: "10000.00",

    transactions: [
      { created_at: moment().subtract(1, 'day').toISOString(), transaction_type: "Buy", transaction_amount: "1450.00" },
      { created_at: moment().subtract(2, 'days').toISOString(), transaction_type: "Sell", transaction_amount: "500.00" },
    ],
    watchlist: [
      { ticker_symbol: 'AAPL', companyName: 'Apple Inc.' },
      { ticker_symbol: 'GOOG', companyName: 'Alphabet Inc.' }
    ],
  },
};

const initialState = {
  entities: {
    users: portfolio,
    stock: {},
  },
  errors: {
    session: {}
  }
};

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Dashboard component', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);

    require('../../../util/util').fetchValidPricesForTicker.mockReset();
    require('../../../util/util').transformFinModelPrepRawData.mockReset();
    require('../../../util/util').fetchValidPricesForTicker.mockResolvedValue(samplePriceData);
    require('../../../util/util').transformFinModelPrepRawData.mockImplementation(() => transformedPriceData);
    require('../../../util/stock_api_util').fetchAllNews.mockReset();
    require('../../../util/stock_api_util').fetchAllNews.mockResolvedValue({
      articles: [{ title: "News 1", source: { name: 'ABC' } }, { title: "News 2", source: { name: 'ABC' } }]
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
  };

  test('renders Dashboard with News and Watchlist sections', async () => {
    renderComponent();

    await waitFor(() => {
      expect(require('../../../util/util').fetchValidPricesForTicker).toHaveBeenCalled();
      expect(require('../../../util/stock_api_util').fetchAllNews).toHaveBeenCalled();
    });

    expect(screen.getByText("News")).toBeInTheDocument();

    expect(screen.getByText("Watchlist")).toBeInTheDocument();
  });

  test('updates news when "Show Newer Articles" button is clicked', async () => {
    renderComponent();

    await waitFor(() => {
      expect(require('../../../util/stock_api_util').fetchAllNews).toHaveBeenCalled();
    });

    const newsButton = screen.getByRole('button', { name: "Show Newer Articles" });

    require('../../../util/stock_api_util').fetchAllNews.mockResolvedValueOnce({
      articles: [{ title: "News 3", source: { name: 'ABC' } }]
    });

    userEvent.click(newsButton);

    await waitFor(() => {
      expect(screen.getByText("News 3")).toBeInTheDocument();
    });
  });
});