json.extract! user, :id, :email_address, :first_name, :funds, :last_name, :address, :phone_number, :portfolio_value, :transaction_ids, :watchlist_ids
json.transactions user.transactions do |transaction|
  json.ticker_symbol  transaction.ticker_symbol
  json.transaction_amount transaction.transaction_amount
  json.created_at transaction.created_at 
  json.transaction_type transaction.transaction_type
end

json.watchlist user.watchlists do |watchlist|
  json.ticker_symbol watchlist.ticker_symbol
end