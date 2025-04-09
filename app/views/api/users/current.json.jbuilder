json.user do
  json.id user.id
  json.email_address user.email_address
  json.first_name user.first_name
  json.last_name user.last_name
  json.funds user.funds
  json.address user.address
  json.phone_number user.phone_number
  json.portfolio_value user.portfolio_value
  json.total_stock_count user.total_stock_count
  json.additional_address user.additional_address
  json.city user.city
  json.state user.state
  json.zip_code user.zip_code
  json.social_security_number user.social_security_number
  json.date_of_birth user.date_of_birth
  json.citizenship user.citizenship
  json.investing_experience user.investing_experience
  json.options_trading_preference user.options_trading_preference
  json.employment_status user.employment_status
  json.salary_range user.salary_range
  json.job_address user.job_address
  json.job_additional_address user.job_additional_address
  json.job_city user.job_city
  json.job_state user.job_state
  json.job_zip_code user.job_zip_code
  json.employer_name user.employer_name
  json.employment_conflict user.employment_conflict
  json.job_description user.job_description
  json.job_industry user.job_industry
  json.family_status user.family_status
  json.family_employment user.family_employment
  json.conflict_firm_name user.conflict_firm_name
  json.conflict_employee_name user.conflict_employee_name
  json.conflict_relationship user.conflict_relationship
  json.reported_all_income user.reported_all_income
  json.margin_account user.margin_account
  json.data_sharing user.data_sharing

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

