const getDateRange = (period) => {
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = new Date();
  const endDate = formatDate(today);
  const startDate = new Date(today);

  if (period !== "1d") {
    const value = parseInt(period, 10);
    const unit = period.slice(-1).toLowerCase();

    const adjustDate = {
      w: () => startDate.setDate(startDate.getDate() - value * 7),
      m: () => startDate.setMonth(startDate.getMonth() - value),
      y: () => startDate.setFullYear(startDate.getFullYear() - value),
    };

    if (adjustDate[unit]) adjustDate[unit]();
  }

  return {
    startDate: formatDate(startDate),
    endDate: endDate
  };
};

export const getTickerQuery = (ticker, range) => {
  switch (range) {
    case VALID_RANGES.ONE_DAY: return { ticker, range, value: '1D', timeFrame: "1min", ...getDateRange("1d") };
    case VALID_RANGES.FIVE_DAYS: return { ticker, range, value: '1W', timeFrame: "5min", ...getDateRange("1w") };
    case VALID_RANGES.ONE_MONTH: return { ticker, range, value: '1M', timeFrame: "15min", ...getDateRange("1m") };
    case VALID_RANGES.THREE_MONTHS: return { ticker, range, value: '3M', timeFrame: "30min", ...getDateRange("3m") };
    case VALID_RANGES.ONE_YEAR: return { ticker, range, value: '1Y', timeFrame: "1hour", ...getDateRange("1y") };
    case VALID_RANGES.FIVE_YEARS: return { ticker, range, value: '5Y', timeFrame: "4hour", ...getDateRange("5y") };
    default: return { ticker, range, value: '1D', timeFrame: "1min", ...getDateRange("1d") };
  }
};

export const VALID_RANGES = {
  ONE_DAY: "1D",
  FIVE_DAYS: "5D",
  ONE_MONTH: "1M",
  THREE_MONTHS: "3M",
  ONE_YEAR: "1Y",
  FIVE_YEARS: "5Y",
};

export const ORDER_ACTION = {
  BUY: 'BUY',
  SELL: 'SELL',
};

export const transformFinModelPrepRawData = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) return [];
  return rawData.reverse().map(({ date, open, high, low, close }, idx) => {
    const [datePart, timePart] = date.split(" ");
    return {
      date: datePart,
      time: timePart,
      open,
      high,
      low,
      close,
      price: close, // use close as the price
      idx
    };
  });
};

// Helper to format a Date object as "yyyy-mm-dd"
const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// This function attempts to fetch prices for a single trading day.
// If no data is returned (empty array), it steps back one day and retries.
export const fetchValidPricesForTicker = async (ticker, maxAttempts = 5) => {
  let attempt = 0;
  let prices = [];
  // Start with today's date
  let date = new Date();

  // Loop until we get data or we exceed our maximum attempts.
  while (attempt < maxAttempts) {
    // For a one-day query, we want startDate and endDate to be the same.
    const currentDate = formatDate(date);
    // Build a query object by using your existing getTickerQuery function for "1d",
    // then override startDate and endDate.
    const baseQuery = getTickerQuery(ticker, VALID_RANGES.ONE_DAY);
    const query = { ...baseQuery, startDate: currentDate, endDate: currentDate };
    
    // Make the API call.
    prices = await fetchPrices(query);
    
    if (prices && prices.length > 0) {
      // We got some data—exit the loop.
      break;
    } else {
      console.warn(`No data for ${ticker} on ${currentDate}. Trying previous day.`);
      // Decrement the date by one day
      date.setDate(date.getDate() - 1);
      attempt++;
    }
  }
  return prices;
};