export const addToWatchlist = watchlist => (
  $.ajax({
    method: "POST",
    url: "api/watchlists",
    data: { watchlist }
  })
);

export const deleteFromWatchlist = watchlist => (
  $.ajax({
    method: "DELETE",
    url: `api/watchlists/${watchlist.ticker_symbol}`
  })
)