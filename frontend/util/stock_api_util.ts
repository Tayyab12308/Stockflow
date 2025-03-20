import axios, { AxiosRequestConfig } from 'axios';

export enum API_NAMES {
  FINANCIAL_MODEL_PREP_API = "FINANCIAL_MODEL_PREP_API",
  ALPHA_VANTAGE_API = "ALPHA_VANTAGE_API",
};

// Define API Key Store
interface ApiDetails {
  lastValidIndex: number;
  keys: string[];
}

export const API_DETAILS: Record<API_NAMES, ApiDetails> = {
  [API_NAMES.FINANCIAL_MODEL_PREP_API]: {
    lastValidIndex: 0,
    keys: [
      window.finModelPrepAPIKeyOne,
      window.finModelPrepAPIKeyTwo,
      window.finModelPrepAPIKeyThree,
      window.finModelPrepAPIKeyFour,
      window.finModelPrepAPIKeyFive,
      window.finModelPrepAPIKeySix,
      window.finModelPrepAPIKeySeven,
      window.finModelPrepAPIKeyEight,
      window.finModelPrepAPIKeyNine,
    ],
  },
  [API_NAMES.ALPHA_VANTAGE_API]: {
    lastValidIndex: 0,
    keys: [
      window.alphaVantageAPIKeyOne,
      window.alphaVantageAPIKeyTwo,
      window.alphaVantageAPIKeyThree,
      window.alphaVantageAPIKeyFour,
      window.alphaVantageAPIKeyFive,
      window.alphaVantageAPIKeySix,
      window.alphaVantageAPIKeySeven,
      window.alphaVantageAPIKeyEight,
      window.alphaVantageAPIKeyNine,
      window.alphaVantageAPIKeyTen,
    ],
  },
};

class ApiLimitExceededError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype); // Ensure correct prototype chain
  }
}

const makeRequestWithCachedKey = async (axiosOptions: AxiosRequestConfig, apiName: API_NAMES) => {
  const tryKey = async (keyIndex: number) => {
    const currentKey = API_DETAILS[apiName].keys[keyIndex];
    if (!currentKey) {
      throw new Error(`API Key is undefined for ${apiName} at idx: ${keyIndex}`);
    }
    // Replace the placeholder in the URL with the current key.
    const options = {
      ...axiosOptions,
      url: axiosOptions.url?.replace(/apikey=[^&]*/, `apikey=${currentKey}`),
    };

    try {
      const response = await axios(options);
      const res = response.data;
      if (res?.Information?.toLowerCase().includes('limit')) {
        throw new ApiLimitExceededError('API limit exceeded', 429);;
      }
      // On success, update the cached key.
      API_DETAILS[apiName].lastValidIndex = keyIndex;
      return res;
    } catch (err: any) {
      const status = err.response ? err.response.status : err.status;
      if (status === 429 && keyIndex < API_DETAILS[apiName].keys.length - 1) {
        return tryKey(keyIndex + 1);
      } else {
        throw err;
      }
    }
  };

  return tryKey(API_DETAILS[apiName].lastValidIndex);
};

// Define Function Parameters
export interface FetchPricesParams {
  ticker: string;
  timeFrame: string;
  startDate: string;
  endDate: string;
}

export const fetchPrices = async ({
  ticker,
  timeFrame,
  startDate,
  endDate
}: FetchPricesParams): Promise<any> =>
  await makeRequestWithCachedKey(
    {
      method: "GET",
      url: `https://financialmodelingprep.com/api/v3/historical-chart/${timeFrame}/${ticker}?from=${startDate}&to=${endDate}&apikey=REPLACE_API_KEY`,
      // Axios defaults to JSON parsing so dataType is not needed.
    },
    API_NAMES.FINANCIAL_MODEL_PREP_API
  );

export const searchStock = async (query: string): Promise<any> =>
  await makeRequestWithCachedKey(
    {
      method: "GET",
      url: `https://financialmodelingprep.com/api/v3/search-ticker?query=${query}&limit=10&apikey=REPLACE_API_KEY`,
    },
    API_NAMES.FINANCIAL_MODEL_PREP_API
  );

export const fetchCompany = async (symbol: string): Promise<any> =>
  await makeRequestWithCachedKey(
    {
      method: "GET",
      url: `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=REPLACE_API_KEY`,
    },
    API_NAMES.ALPHA_VANTAGE_API
  );

export const fetchKeyStats = async (symbol: string): Promise<any> =>
  await makeRequestWithCachedKey(
    {
      method: "GET",
      url: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=REPLACE_API_KEY`,
    },
    API_NAMES.ALPHA_VANTAGE_API
  );

export const fetchNews = async (symbol: string): Promise<any> => {
  return axios({
    method: "GET",
    url: `https://newsapi.org/v2/top-headlines?q=${symbol}&pageSize=10&apiKey=${window.newsAPIKey}`,
  }).then(response => response.data);
};

export const fetchAllNews = async (): Promise<any> => {
  return axios({
    method: "GET",
    url: `https://newsapi.org/v2/top-headlines?country=us&category=business&articles=15&apiKey=${window.newsAPIKey}`,
  }).then(response => response.data);
};

export const fetchCompanyProfile = async (symbol: string): Promise<any> =>
  await makeRequestWithCachedKey(
    {
      method: "GET",
      url: `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=REPLACE_API_KEY`,
    },
    API_NAMES.FINANCIAL_MODEL_PREP_API
  );
