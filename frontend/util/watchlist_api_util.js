export const createWatchlist = watchlist => (
  $.ajax({
    method: "POST",
    url: "api/watchlists",
    data: { watchlist }
  })
);

export const deleteWatchlist = watchlist => (
  $.ajax({
    method: "DELETE",
    url: "api/watchlist"
  })
)