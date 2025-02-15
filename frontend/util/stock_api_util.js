let lastValidKeyIndex = 0;

const FINANCIAL_MODEL_PREP_API_KEYS = [
  window.finModelPrepAPIKeyOne,
  window.finModelPrepAPIKeyTwo,
  window.finModelPrepAPIKeyThree,
  window.finModelPrepAPIKeyFour,
  window.finModelPrepAPIKeyFive,
  window.finModelPrepAPIKeySix,
  window.finModelPrepAPIKeySeven,
  window.finModelPrepAPIKeyEight,
  window.finModelPrepAPIKeyNine,
];

const makeRequestWithCachedKey = async (ajaxOptions) => {
  const tryKey = async (keyIndex) => {
    const currentKey = FINANCIAL_MODEL_PREP_API_KEYS[keyIndex];
    console.log("Trying Key:", currentKey)
    const options = {
      ...ajaxOptions,
      url: ajaxOptions.url.replace(/apikey=[^&]*/, `apikey=${currentKey}`)
    };

    try {
      const res = await $.ajax(options);
      console.log({ res })
      // On success, update the cached key.
      lastValidKeyIndex = keyIndex;
      return res;
    } catch (err) {
      console.error("AJAX error:", err);
      if (err.status === 429 && keyIndex < FINANCIAL_MODEL_PREP_API_KEYS.length - 1) {
        console.warn(`Key ${currentKey} exceeded. Trying next key.`);
        return tryKey(keyIndex + 1);
      } else {
        throw err;
      }
    }
  };

  return tryKey(lastValidKeyIndex);
};

export const fetchPrices = async ({ticker, timeFrame, startDate, endDate}) => await makeRequestWithCachedKey(
  {
    method: "GET",
    url: `https://financialmodelingprep.com/api/v3/historical-chart/${timeFrame}/${ticker}?from=${startDate}&to=${endDate}&apikey=REPLACE_API_KEY`,
    dataType: 'json'
  }
);

export const searchStock = async (string) => await makeRequestWithCachedKey(
  {
    method: "GET",
    url: `https://financialmodelingprep.com/api/v3/search-ticker?query=${string}&limit=10&apikey=REPLACE_API_KEY`,
  }
);

export const fetchCompany = symbol => (
  $.ajax({
    method: "GET",
    url: `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${window.alphaVantageAPIKey}`
  })
);

export const fetchKeyStats = symbol => (
  $.ajax({
    method: "GET",
    url: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${window.alphaVantageAPIKey}`
  })
);

export const fetchNews = symbol => (
  $.ajax({
    method: "GET",
    url: `https://newsapi.org/v2/top-headlines?q=${symbol}&pageSize=10&apiKey=${window.newsAPIKey}`
  })
);

export const fetchAllNews = () => (
  $.ajax({
    method: "GET",
    url: `https://newsapi.org/v2/top-headlines?country=us&category=business&articles=15&apiKey=${window.newsAPIKey}`
  })
);

export const fetchCompanyProfile = async (symbol) => await makeRequestWithCachedKey(
  {
    method: "GET",
    url: `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=REPLACE_API_KEY`
  }
)
;