import { PriorityQueue } from "js-sdsl";
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
  console.log({ today, startDate, endDate })

  if (period !== "1D") {
    const value = parseInt(period, 10);
    const unit = period.slice(-1).toLowerCase();

    const adjustDate: Record<typeof unit, () => void> = {
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
    "1D": { value: '1D', timeFrame: "1 minute" },
    "1W": { value: '1W', timeFrame: "5 minute" },
    "1M": { value: '1M', timeFrame: "15 minute" },
    "3M": { value: '3M', timeFrame: "30 minute" },
    "1Y": { value: '1Y', timeFrame: "1 hour" },
    "5Y": { value: '5Y', timeFrame: "4 hour" },
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

export const formatNumber = (num: number) => {
  const _suffix = ["K", "M", "B", "T"]
  if (num > 1000) {
    let i = 0
    while (num > 1000) {
      num /= 1000
      i += 1
    }
    return `${num.toFixed(2)}${_suffix[i - 1]}`
  }
  return num
}

export const timeSince = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const units = [
    { label: 'y', seconds: 31536000 }, // 1 year = 31536000 seconds
    { label: 'mo', seconds: 2592000 }, // 1 month = 2592000 seconds
    { label: 'w', seconds: 604800 },   // 1 week = 604800 seconds
    { label: 'd', seconds: 86400 },    // 1 day = 86400 seconds
    { label: 'h', seconds: 3600 },     // 1 hour = 3600 seconds
    { label: 'm', seconds: 60 },       // 1 minute = 60 seconds
    { label: 's', seconds: 1 }         // 1 second = 1 second
  ];

  for (const unit of units) {
    const interval = Math.floor(diffInSeconds / unit.seconds);
    if (interval >= 1) {
      return `${interval}${unit.label}`;
    }
  }
  return '0s'; // If the difference is less than 1 second
}

/**
 * Finds the top k stocks with the largest absolute percentage changes.
 * @param stocks - Array of stock objects
 * @param k - Number of top elements to return (default: 6)
 * @returns Array of top k stocks in descending order of absolute percentage change
 */
export const findTopStocks = <T,>(stocks: T[], k: number = 6, comparator: any, heapRemovalComparator: (heap: PriorityQueue<T>, stock: T) => boolean): T[] => {
  // Initialize a min-heap with a comparator based on absolute percentage change
  const minHeap = new PriorityQueue<T>(
    [],
    comparator
  );

  // Process each stock in the dataset
  for (const stock of stocks) {
    if (minHeap.size() < k) {
      // If heap has fewer than k elements, add the stock
      minHeap.push(stock);
    } else if (heapRemovalComparator(minHeap, stock)) {
      // If heap is full and current stock has a larger absolute change than the smallest,
      // remove the smallest and add the current stock
      minHeap.pop();
      minHeap.push(stock);
    }
  }

  // Extract all elements from the heap
  const topStocks: T[] = [];
  while (minHeap.size() > 0) {
    topStocks.push(minHeap.pop()!);
  }

  // Sort in descending order of absolute percentage change
  topStocks.sort(comparator);

  return topStocks;
}