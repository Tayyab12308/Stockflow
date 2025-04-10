import axios from "axios";
import { getApiKeys } from "../services/apiKeyService";

/**
 * Fetch aggregated price data from Polygon API with pagination support
 */
export const fetchAllAggregatesUsingAxios = async (
  ticker: string,
  multiplier: number,
  timespan: string,
  from: string,
  to: string,
  options: Record<string, any> = {}
): Promise<any[]> => {
  try {

    console.log('[fetchAllAggreatesUsingAxios]', { ticker, multiplier, timespan, from, to, options })
    // Securely get API key
    const apiKeys = await getApiKeys();
    const API_KEY = apiKeys.polygon_api_key;

    // Construct the URL for the first page
    const baseUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}`;
    let allResults: any[] = [];
    // Include your options and API key as query parameters
    const params = { ...options, apiKey: API_KEY };

    // Get the first page.
    let response = await axios.get(baseUrl, { params });
    const data = response.data;

    if (!data.results) {
      console.warn("No results returned from API:", data);
      return [];
    }

    allResults = allResults.concat(data.results);
    let nextUrl: string | null = data.next_url;

    // Use axios to repeatedly fetch subsequent pages until no next_url exists.
    while (nextUrl) {
      const nextResponse = await axios.get(nextUrl, { params });
      const nextData = nextResponse.data;
      allResults = allResults.concat(nextData.results);
      nextUrl = nextData.next_url;
    }
    return allResults;
  } catch (error) {
    console.error("Error fetching aggregates:", error);
    return [];
  }
};

/**
 * Fetch technical indicator data from Polygon API
 */
export const fetchTechnicalIndicator = async (
  ticker: string,
  indicator: string,
  multiplier: number,
  timespan: string,
  from: string,
  to: string,
  params: Record<string, any> = {}
): Promise<any[]> => {
  try {
    // Securely get API key
    const apiKeys = await getApiKeys();
    const API_KEY = apiKeys.polygon_api_key;
  
    const url = `https://api.polygon.io/v1/indicators/${indicator}/${ticker}`;
    const queryParams = {
      timespan,
      "timestamp.gte": from,
      "timestamp.lte": to,
      order: 'asc',
      limit: 5000,
      apiKey: API_KEY,
      ...params
    };

    const response = await axios.get(url, { params: queryParams });

    return response.data.results?.values || [];
  } catch (error) {
    console.error(`Error fetching ${indicator} for ${ticker}:`, error);
    return [];
  }
};

/**
 * Fetch technical indicator data with retry logic for recent days
 */
export const fetchTechnicalIndicatorWithRetry = async (
  ticker: string,
  indicator: string,
  maxAttempts = 5,
  params: Record<string, any> = {}
): Promise<any[]> => {
  let attempt = 0;
  let data = [];
  // Start with today's date
  let date = new Date();

  while (attempt < maxAttempts) {
    const currentDate = formatDate(date);

    try {
      // Use minute timeframe for 1D data
      data = await fetchTechnicalIndicator(
        ticker,
        indicator,
        1,
        'minute',
        currentDate,
        currentDate,
        params
      );

      if (data?.length > 0) {
        // We got some data—exit the loop
        break;
      } else {
        console.warn(`No ${indicator} data for ${ticker} on ${currentDate}. Trying previous day.`);
        // Decrement the date by one day
        date.setDate(date.getDate() - 1);
        attempt++;
      }
    } catch (error) {
      console.error(`Error fetching ${indicator} for ${ticker} on ${currentDate}:`, error);
      date.setDate(date.getDate() - 1);
      attempt++;
    }
  }
  return data;
};

/**
 * Format date to YYYY-MM-DD for Polygon API
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * This function attempts to fetch prices for a single trading day using Polygon API
 * If no data is returned (empty array), it steps back one day and retries
 */
export const fetchValidPricesForTicker = async (ticker: string, maxAttempts = 5) => {
  let attempt = 0;
  let prices = [];
  
  // Get current date in New York time (market time)
  const nyOptions = { timeZone: 'America/New_York' };
  let date = new Date(new Date().toLocaleString('en-US', nyOptions));

  while (attempt < maxAttempts) {
    // Format current date in YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    
    // Calculate next day
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextYear = nextDay.getFullYear();
    const nextMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
    const nextDay2 = String(nextDay.getDate()).padStart(2, '0');
    const nextDate = `${nextYear}-${nextMonth}-${nextDay2}`;

    console.log('[fetchValidPricesForTicker]', { 
      currentDate, 
      nextDate, 
      attempt,
      nyTime: date.toLocaleString('en-US', nyOptions),
      browserTime: new Date().toISOString()
    });

    try {
      prices = await fetchAllAggregatesUsingAxios(
        ticker,
        1,
        "minute",
        currentDate,
        nextDate,
        {
          adjusted: "true",
          sort: "asc",
          limit: 5000,
        }
      );

      console.log({ prices });

      if (prices?.length > 0) {
        break;
      } else {
        console.warn(`No data for ${ticker} from ${currentDate} to ${nextDate}. Trying previous day.`);
        date.setDate(date.getDate() - 1);
        attempt++;
      }
    } catch (error) {
      console.error(`Error fetching data for ${ticker} from ${currentDate} to ${nextDate}:`, error);
      date.setDate(date.getDate() - 1);
      attempt++;
    }
  }
  return prices;
};

/**
 * Fetch news for a specific ticker
 */
export const fetchTickerNews = async (ticker: string) => {
  try {
    // Securely get API key
    const apiKeys = await getApiKeys();
    const API_KEY = apiKeys.polygon_api_key;

    const response = await axios.get(`https://api.polygon.io/v2/reference/news?ticker=${ticker}&apiKey=${API_KEY}&order=desc&limit=10&sort=published_utc`);
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

export const fetchTodayData = async (ticker: string) => {
  // Create date formatter for Eastern Time
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // Get today's date in US Eastern Time (market time)
  const now = new Date();
  const [month, day, year] = formatter.format(now).split('/');
  const todayString = `${year}-${month}-${day}`;
  
  // Get next day - add one day to the numeric day value
  const nextDay = new Date(now);
  nextDay.setDate(nextDay.getDate() + 1);
  const [nextMonth, nextDay2, nextYear] = formatter.format(nextDay).split('/');
  const nextDateString = `${nextYear}-${nextMonth}-${nextDay2}`;

  console.log('[fetchTodayData]', { 
    requestedDate: todayString, 
    nextDate: nextDateString,
    browserDate: now.toISOString().split('T')[0],
    currentTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    easternTime: formatter.format(now)
  });
  
  return fetchAllAggregatesUsingAxios(
    ticker,
    1,
    'minute',
    todayString,
    nextDateString,
    { adjusted: 'true', sort: 'asc', limit: 5000 }
  );
};