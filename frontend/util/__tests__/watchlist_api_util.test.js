jest.mock('jquery');
import { addToWatchlist, deleteFromWatchlist } from '../watchlist_api_util';

describe('watchlist_api_util', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('addToWatchlist calls $.ajax with correct parameters', async () => {
    const watchlist = { ticker_symbol: 'AAPL', extra: 'data' };

    await addToWatchlist(watchlist);

    expect($.ajax).toHaveBeenCalledWith({
      method: "POST",
      url: "/api/watchlists",
      data: { watchlist },
    });
  });

  test('deleteFromWatchlist calls $.ajax with correct parameters', async () => {
    const watchlist = { ticker_symbol: 'AAPL' };

    await deleteFromWatchlist(watchlist);

    expect($.ajax).toHaveBeenCalledWith({
      method: "DELETE",
      url: `/api/watchlists/${watchlist.ticker_symbol}`,
    });
  });
});