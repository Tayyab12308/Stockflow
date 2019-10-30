json.user do
  json.id user.id
  json.email_address user.email_address
  json.first_name user.first_name
  json.last_name user.last_name
  json.funds user.funds
  json.address user.address
  json.phone_number user.phone_number
  json.portfolio_value user.portfolio_value

  json.transactions user.transactions do |transaction|
    json.id transaction.id
    json.ticker_symbol  transaction.ticker_symbol
    json.transaction_amount transaction.transaction_amount
    json.created_at transaction.created_at 
    json.transaction_type transaction.transaction_type
  end

  json.watchlist user.watchlists do |watchlist|
    json.id watchlist.id
    json.ticker_symbol watchlist.ticker_symbol
  end
end

