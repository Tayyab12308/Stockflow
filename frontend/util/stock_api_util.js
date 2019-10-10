export const fetchPrices = ({ticker, range}) => (
  $.ajax({
    method: "GET",
    url: `https://cloud.iexapis.com//stable/stock/${ticker}/chart/${range}/quote/?token=${window.iexAPIKey}`
  })
);

export const searchStock = string => (
  $.ajax({
    method: "GET",
    url: `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${string}&apikey=${window.alphaVantageAPIKey}`,
  })
);

export const fetchCompany = symbol => (
  $.ajax({
    method: "GET",
    url: `https://cloud.iexapis.com/stable/stock/${symbol}/company/?token=${window.iexAPIKey}`
  })
);

export const fetchKeyStats = symbol => (
  $.ajax({
    method: "GET",
    url: `https://cloud.iexapis.com/stable/stock/${symbol}/quote/?token=${window.iexAPIKey}`
  })
)

export const fetchNews = symbol => (
  $.ajax({
    method: "GET",
    url: `https://newsapi.org/v2/top-headlines?q=${symbol}&pageSize=10&apiKey=465591c2e4c64c8d8494cfc4f9c19d28`
  })
)