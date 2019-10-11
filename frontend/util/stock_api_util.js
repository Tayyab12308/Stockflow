export const fetchPrices = ({ticker, range}) => (
  $.ajax({
    method: "GET",
    url: `https://cloud.iexapis.com/stable/stock/${ticker}/chart/${range}/?token=${window.iexAPIKey}`
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

export const fetchBatchRequest = symbolArr => {
  let symbol = symbolArr.join(",")
  return (
  $.ajax({
    method: "GET",
    url: `https://cloud.iexapis.com/stable/stock/market/batch?symbols=${symbol}&types=chart&range=1d&token=${window.iexAPIKey}`
  })
  )
}