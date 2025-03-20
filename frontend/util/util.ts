import { fetchPrices } from "./stock_api_util";

export type Period = `${number}${'D' | 'W' | 'M' | 'Y'}`;

export interface DateRange {
  startDate: string;
  endDate: string;
}

export const getDateRange = (period: Period) => {
  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = new Date();
  const endDate = formatDate(today);
  const startDate = new Date(today);

  if (period !== "1D") {
    const value = parseInt(period, 10);
    const unit = period.slice(-1).toLowerCase();

    const adjustDate: Record<typeof unit, () => void> = {
      W: () => startDate.setDate(startDate.getDate() - value * 7),
      M: () => startDate.setMonth(startDate.getMonth() - value),
      Y: () => startDate.setFullYear(startDate.getFullYear() - value),
    };

    if (adjustDate[unit]) adjustDate[unit]();
  }

  return {
    startDate: formatDate(startDate),
    endDate: endDate
  };
};

export type ValidRange =
  | "1D"
  | "5D"
  | "1M"
  | "3M"
  | "1Y"
  | "5Y";


export interface TickerQuery {
  ticker: string;
  range: Period;
  value: string;
  timeFrame: string;
  startDate: string;
  endDate: string;
}

export const getTickerQuery = (ticker: string, range: Period): TickerQuery => {
  const rangeSettings: Record<Period, { value: string; timeFrame: string; }> = {
    "1D": { value: '1D', timeFrame: "1min" },
    "5D": { value: '1W', timeFrame: "5min" },
    "1M": { value: '1M', timeFrame: "15min" },
    "3M": { value: '3M', timeFrame: "30min" },
    "1Y": { value: '1Y', timeFrame: "1hour" },
    "5Y": { value: '5Y', timeFrame: "4hour" },
  }
  
  return {
    ticker,
    range,
    ...rangeSettings[range],
    ...getDateRange(range),
  }
};

export const VALID_RANGE_TO_PERIOD: Record<ValidRange, Period> = {
  "1D": "1D",
  "5D": "1W", // Approximate 5-day trading week as 1 week
  "1M": "1M",
  "3M": "3M",
  "1Y": "1Y",
  "5Y": "5Y",
};

// Function to convert a ValidRange to its associated Period
export const getPeriodFromValidRange = (range: ValidRange): Period => {
  return VALID_RANGE_TO_PERIOD[range];
};

export const ORDER_ACTION = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const;

export interface FinancialDataPoint {
  date: string;
  time?: string;
  open: number;
  high: number;
  low: number;
  close: number;
  price: number;
  idx: number;
}

export const transformFinModelPrepRawData = (rawData: any[]): FinancialDataPoint[] => {
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
const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// This function attempts to fetch prices for a single trading day.
// If no data is returned (empty array), it steps back one day and retries.
export const fetchValidPricesForTicker = async (ticker: string, maxAttempts = 5) => {
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
    const baseQuery = getTickerQuery(ticker, getPeriodFromValidRange("1D"));
    const query = { ...baseQuery, startDate: currentDate, endDate: currentDate };
    
    // Make the API call.
    prices = await fetchPrices(query);
    
    if (prices?.length > 0) {
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

// Generic recursive key conversion helper
const convertKeys = (obj: any, transformKey: (key: string) => string): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeys(item, transformKey));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = transformKey(key);
      acc[newKey] = convertKeys(obj[key], transformKey);
      return acc;
    }, {} as Record<string, any>);
  }
  return obj;
};

// Helper to convert camelCase to snake_case
const camelToSnake = (str: string): string =>
  str
    // Insert underscore between a lowercase letter or digit and an uppercase letter.
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    // Insert underscore between a letter and a digit.
    .replace(/([a-zA-Z])([0-9])/g, '$1_$2')
    .toLowerCase();

// Helper to convert snake_case to camelCase
const snakeToCamel = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// Export functions using the generic helper
export const convertKeysToSnakeCase = (obj: any): any => convertKeys(obj, camelToSnake);

export const convertKeysToCamelCase = (obj: any): any => convertKeys(obj, snakeToCamel);

