export const fetchPrices = ({ticker, range}) => (
  $.ajax({
    method: "GET",
    url: `https://cloud.iexapis.com//stable/stock/${ticker}/chart/${range}/quote/?token=pk_7e68c694e05b4d7f8a5803a21fc411a0`
  })
);

export const searchStock = string => (
  $.ajax({
    method: "GET",
    url: `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${string}&apikey=AZ0HDRM7I3T6N8FU`,
  })
);

export const fetchCompany = symbol => (
  $.ajax({
    method: "GET",
    url: `https://cloud.iexapis.com/stable/stock/${symbol}/company/?token=pk_7e68c694e05b4d7f8a5803a21fc411a0`
  })
);

export const fetchKeyStats = symbol => (
  $.ajax({
    method: "GET",
    url: `https://cloud.iexapis.com/stable/stock/${symbol}/quote/?token=pk_7e68c694e05b4d7f8a5803a21fc411a0`
  })
)