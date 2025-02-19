import {
  getDateRange,
  getTickerQuery,
  VALID_RANGES,
  transformFinModelPrepRawData,
  fetchValidPricesForTicker,
} from '../util';

// --- getDateRange tests ---
describe('getDateRange', () => {
  test('returns the same start and end date for period "1d"', () => {
    const { startDate, endDate } = getDateRange("1d");
    expect(startDate).toEqual(endDate);
    expect(startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('adjusts date correctly for a weekly period ("1w")', () => {
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const today = new Date();
    const expectedEndDate = today.toLocaleDateString('en-CA', { timeZone: localTimeZone });
    
    const startDateObj = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const expectedStartDate = startDateObj.toLocaleDateString('en-CA', { timeZone: localTimeZone });
    
    const { startDate, endDate } = getDateRange("1w");
    
    expect(endDate).toEqual(expectedEndDate);
    expect(startDate).toEqual(expectedStartDate);
  });

  test('adjusts date correctly for a weekly period ("1w")', () => {
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const today = new Date();
    const expectedEndDate = today.toLocaleDateString('en-CA', { timeZone: localTimeZone });
    
    const startDateObj = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const expectedStartDate = startDateObj.toLocaleDateString('en-CA', { timeZone: localTimeZone });
    
    const { startDate, endDate } = getDateRange("1w");
    
    expect(endDate).toEqual(expectedEndDate);
    expect(startDate).toEqual(expectedStartDate);
  });

  test('adjusts date correctly for a monthly period ("1m")', () => {
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = new Date();
    const expectedEndDate = today.toLocaleDateString('en-CA', { timeZone: localTimeZone });

    const startDateObj = new Date(today);
    startDateObj.setMonth(startDateObj.getMonth() - 1);
    const expectedStartDate = startDateObj.toLocaleDateString('en-CA', { timeZone: localTimeZone });

    const { startDate, endDate } = getDateRange("1m");

    expect(endDate).toEqual(expectedEndDate);
    expect(startDate).toEqual(expectedStartDate);
  });

  test('adjusts date correctly for a yearly period ("1y")', () => {
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = new Date();
    const expectedEndDate = today.toLocaleDateString('en-CA', { timeZone: localTimeZone });

    const startDateObj = new Date(today);
    startDateObj.setFullYear(startDateObj.getFullYear() - 1);
    const expectedStartDate = startDateObj.toLocaleDateString('en-CA', { timeZone: localTimeZone });

    const { startDate, endDate } = getDateRange("1y");

    expect(endDate).toEqual(expectedEndDate);
    expect(startDate).toEqual(expectedStartDate);
  });

  test('returns the same start and end date for invalid period', () => {
    const { startDate, endDate } = getDateRange("1k");
    expect(startDate).toEqual(endDate);
    expect(startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

// --- getTickerQuery tests ---
describe('getTickerQuery', () => {
  const ticker = 'AAPL';
  
  // Create a mapping from each valid range value to its expected query parts.
  const expectedMapping = {
    [VALID_RANGES.ONE_DAY]: { value: '1D', timeFrame: '1min', periodArg: '1d' },
    [VALID_RANGES.FIVE_DAYS]: { value: '1W', timeFrame: '5min', periodArg: '1w' },
    [VALID_RANGES.ONE_MONTH]: { value: '1M', timeFrame: '15min', periodArg: '1m' },
    [VALID_RANGES.THREE_MONTHS]: { value: '3M', timeFrame: '30min', periodArg: '3m' },
    [VALID_RANGES.ONE_YEAR]: { value: '1Y', timeFrame: '1hour', periodArg: '1y' },
    [VALID_RANGES.FIVE_YEARS]: { value: '5Y', timeFrame: '4hour', periodArg: '5y' },
  };

  Object.values(VALID_RANGES).forEach(range => {
    test(`returns correct query for ${range} range`, () => {
      const query = getTickerQuery(ticker, range);
      const expected = expectedMapping[range];

      expect(query).toMatchObject({
        ticker,
        range,
        value: expected.value,
        timeFrame: expected.timeFrame,
      });

      expect(query.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(query.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  test('returns one-day query for incorrect range', () => {
    const ticker = 'AAPL';
    const query = getTickerQuery(ticker, '9i');
    expect(query).toMatchObject({
      ticker,
      range: '9i',
      value: '1D',
      timeFrame: '1min',
    });
    expect(query.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(query.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

// --- transformFinModelPrepRawData tests ---
describe('transformFinModelPrepRawData', () => {
  test('returns empty array for null or non-array input', () => {
    expect(transformFinModelPrepRawData(null)).toEqual([]);
    expect(transformFinModelPrepRawData({})).toEqual([]);
  });

  test('reverses the array and maps fields correctly', () => {
    const rawData = [
      { date: '2025-02-15 09:30:00', open: 100, high: 110, low: 90, close: 105 },
      { date: '2025-02-15 09:31:00', open: 105, high: 115, low: 95, close: 110 },
    ];
    const transformed = transformFinModelPrepRawData(rawData);

    expect(transformed).toHaveLength(2);
    expect(transformed[0]).toEqual({
      date: '2025-02-15',
      time: '09:31:00',
      open: 105,
      high: 115,
      low: 95,
      close: 110,
      price: 110,
      idx: 0,
    });
    expect(transformed[1]).toEqual({
      date: '2025-02-15',
      time: '09:30:00',
      open: 100,
      high: 110,
      low: 90,
      close: 105,
      price: 105,
      idx: 1,
    });
  });
});

// --- fetchValidPricesForTicker tests ---
describe('fetchValidPricesForTicker', () => {
  let originalFetchPrices;

  beforeEach(() => {
    originalFetchPrices = global.fetchPrices;
  });

  afterEach(() => {
    global.fetchPrices = originalFetchPrices;
  });

  test('returns data on first successful fetch', async () => {
    const dummyData = [{ dummy: 'data' }];
    global.fetchPrices = jest.fn().mockResolvedValue(dummyData);
    const result = await fetchValidPricesForTicker('AAPL', 3);
    expect(result).toEqual(dummyData);
    expect(global.fetchPrices).toHaveBeenCalledTimes(1);
  });

  test('returns data when no argument is passed for max attempts', async () => {
    const dummyData = [{ dummy: 'data' }];
    global.fetchPrices = jest.fn().mockResolvedValue(dummyData);
    const result = await fetchValidPricesForTicker('AAPL');
    expect(result).toEqual(dummyData);
    expect(global.fetchPrices).toHaveBeenCalledTimes(1);
  });

  test('retries until valid data is returned', async () => {
    const dummyData = [{ dummy: 'data' }];
    global.fetchPrices = jest.fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(dummyData);

    const result = await fetchValidPricesForTicker('AAPL', 3);
    expect(result).toEqual(dummyData);
    expect(global.fetchPrices).toHaveBeenCalledTimes(2);
  });

  test('stops after maxAttempts and returns empty array if no data', async () => {
    global.fetchPrices = jest.fn().mockResolvedValue([]);
    const result = await fetchValidPricesForTicker('AAPL', 3);
    expect(result).toEqual([]);
    expect(global.fetchPrices).toHaveBeenCalledTimes(3);
  });
});