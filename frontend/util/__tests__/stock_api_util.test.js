global.$ = { ajax: jest.fn() };

import {
  API_NAMES,
  fetchPrices,
  searchStock,
  fetchCompany,
  fetchKeyStats,
  fetchNews,
  fetchAllNews,
  fetchCompanyProfile,
  API_DETAILS
} from '../stock_api_util';

describe('API Calls Module', () => {
  beforeEach(() => {
    $.ajax.mockReset();
  });

  test('fetchPrices resolves with response using the first key', async () => {
    const mockResponse = { data: 'test data' };
    $.ajax.mockResolvedValueOnce(mockResponse);

    const result = await fetchPrices({
      ticker: "AAPL",
      timeFrame: "1min",
      startDate: "2025-02-15",
      endDate: "2025-02-15"
    });

    expect(result).toEqual(mockResponse);
    expect($.ajax.mock.calls[0][0].url)
      .toContain(window.finModelPrepAPIKeyOne);
  });

  test('fetchPrices retries with the next key on a 429 error', async () => {
    const error429 = new Error('Rate limit exceeded');
    error429.status = 429;
    const mockResponse = { data: 'test data' };
    $.ajax
      .mockRejectedValueOnce(error429)
      .mockResolvedValueOnce(mockResponse);

    const result = await fetchPrices({
      ticker: "AAPL",
      timeFrame: "1min",
      startDate: "2025-02-15",
      endDate: "2025-02-15"
    });

    expect(result).toEqual(mockResponse);
    expect($.ajax).toHaveBeenCalledTimes(2);
    expect($.ajax.mock.calls[1][0].url)
      .toContain(window.finModelPrepAPIKeyTwo);
  });

  test('fetchPrices throws error if all keys return 429', async () => {
    API_DETAILS[API_NAMES.FINANCIAL_MODEL_PREP_API].lastValidIndex = 0;
    const error429 = new Error('Rate limit exceeded');
    error429.status = 429;

    // Simulate all 9 keys failing.
    $.ajax
      .mockRejectedValueOnce(error429)
      .mockRejectedValueOnce(error429)
      .mockRejectedValueOnce(error429)
      .mockRejectedValueOnce(error429)
      .mockRejectedValueOnce(error429)
      .mockRejectedValueOnce(error429)
      .mockRejectedValueOnce(error429)
      .mockRejectedValueOnce(error429)
      .mockRejectedValueOnce(error429);

    await expect(fetchPrices({
      ticker: "AAPL",
      timeFrame: "1min",
      startDate: "2025-02-15",
      endDate: "2025-02-15"
    })).rejects.toThrow(error429);
    expect($.ajax).toHaveBeenCalledTimes(9);
  });

  test('searchStock returns results', async () => {
    const mockResponse = [{ symbol: 'AAPL', name: 'Apple Inc.' }];
    $.ajax.mockResolvedValueOnce(mockResponse);

    const result = await searchStock('Apple');
    expect(result).toEqual(mockResponse);
    expect($.ajax.mock.calls[0][0].url).toContain('search-ticker');
  });

  test('fetchCompany returns response', async () => {
    const mockResponse = { companyName: 'Apple Inc.' };
    $.ajax.mockResolvedValueOnce(mockResponse);

    const result = await fetchCompany('AAPL');
    expect(result).toEqual(mockResponse);
    expect($.ajax.mock.calls[0][0].url).toContain('OVERVIEW');
  });

  test('fetchKeyStats returns response', async () => {
    const mockResponse = { "Global Quote": { "02. open": 145 } };
    $.ajax.mockResolvedValueOnce(mockResponse);

    const result = await fetchKeyStats('AAPL');
    expect(result).toEqual(mockResponse);
    expect($.ajax.mock.calls[0][0].url).toContain('GLOBAL_QUOTE');
  });

  test('fetchNews returns response', async () => {
    const mockResponse = { articles: [{ title: 'News 1' }] };
    $.ajax.mockResolvedValueOnce(mockResponse);

    const result = await fetchNews('AAPL');
    expect(result).toEqual(mockResponse);
    expect($.ajax.mock.calls[0][0].url).toContain('top-headlines?q=AAPL');
  });

  test('fetchAllNews returns response', async () => {
    const mockResponse = { articles: [{ title: 'News 1' }] };
    $.ajax.mockResolvedValueOnce(mockResponse);

    const result = await fetchAllNews();
    expect(result).toEqual(mockResponse);
    expect($.ajax.mock.calls[0][0].url).toContain('top-headlines?country=us');
  });

  test('fetchCompanyProfile returns response', async () => {
    const mockResponse = [{ ceo: 'Tim Cook' }];
    $.ajax.mockResolvedValueOnce(mockResponse);

    const result = await fetchCompanyProfile('AAPL');
    expect(result).toEqual(mockResponse);
    expect($.ajax.mock.calls[0][0].url).toContain('profile');
  });

  test('throws error if response indicates limit exceeded', async () => {
    // Simulate successful ajax calls but with a response that indicates the limit is exceeded.
    const responseWithLimit = { Information: "Limit exceeded for this API call" };
    $.ajax
    .mockResolvedValueOnce(responseWithLimit)
    .mockResolvedValueOnce(responseWithLimit)
    .mockResolvedValueOnce(responseWithLimit)
    .mockResolvedValueOnce(responseWithLimit)
    .mockResolvedValueOnce(responseWithLimit)
    .mockResolvedValueOnce(responseWithLimit)
    .mockResolvedValueOnce(responseWithLimit)
    .mockResolvedValueOnce(responseWithLimit)
    .mockResolvedValueOnce(responseWithLimit);
    
    await expect(fetchPrices({
      ticker: "AAPL",
      timeFrame: "1min",
      startDate: "2025-02-15",
      endDate: "2025-02-15"
    })).rejects.toThrow();
  });
});