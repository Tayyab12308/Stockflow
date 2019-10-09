export const fetchPrices = ({ticker, range}) => (
  $.ajax({
    method: "GET",
    url: `https://cloud.iexapis.com//stable/stock/${ticker}/chart/${range}/quote/?token=pk_f3a536371922400fbada524c1bb5393b`
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
    url: `https://cloud.iexapis.com/stable/stock/${symbol}/company/?token=pk_f3a536371922400fbada524c1bb5393b`
  })
);

export const fetchKeyStats = symbol => (
  $.ajax({
    method: "GET",
    url: `https://cloud.iexapis.com/stable/stock/${symbol}/quote/?token=pk_f3a536371922400fbada524c1bb5393b`
  })
)