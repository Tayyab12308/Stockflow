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
  let date = new Date();

  while (attempt < maxAttempts) {
    const currentDate = formatDate(date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDate = formatDate(nextDay);

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
  const today = new Date().toISOString().split('T')[0];
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDate = nextDay.toISOString().split('T')[0];
  return fetchAllAggregatesUsingAxios(
    ticker,
    1,
    'minute',
    today,
    nextDate,
    { adjusted: 'true', sort: 'asc', limit: 5000 }
  );
};