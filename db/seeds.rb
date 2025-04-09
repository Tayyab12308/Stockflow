# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Watchlist.destroy_all
Transaction.destroy_all
User.destroy_all

# u1 = User.create!(first_name: 'John', last_name: 'Doe', email_address: 'johndoe@email.com', password: 'password', funds: 10000, address: "1222 treer ave", phone_number: 3479839234, portfolio_value: 10000)
# u2 = User.create!(first_name: 'Jane', last_name: 'Doe', email_address: 'janedoe@email.com', password: 'password', funds: 50000, address: "3232 nnln st", phone_number: 4443332222)
# u3 = User.create!(first_name: 'Mark', last_name: 'Lee', email_address: 'marklee@email.com', password: 'password', funds: 80000, address: "0323 iiioiui ave", phone_number: 0005554444)
u4 = User.create!(
  first_name: 'Tony',
  last_name: 'Stark',
  email_address: 'tonystark@email.com',
  password: 'password',
  funds: 80000000,
  address: "1324 malibu ave",
  phone_number: "3339995555",
  portfolio_value: 80000000,
  additional_address: "",
  city: "LA",
  state: "California",
  zip_code: "11234",
  social_security_number: "111-99-2222",
  date_of_birth: "08/04/1976",
  citizenship: "United States of America",
  investing_experience: "None",
  options_trading_preference: "NO",
  employment_status: "EMPLOYED",
  salary_range: "MID",
  job_address: '3 World Trade Center',
  job_additional_address: "",
  job_city: "New York",
  job_state: "NY",
  job_zip_code: "10001",
  employer_name: "Marvel",
  employment_conflict: "NO",
  job_description: "Other",
  job_industry: "Other",
  family_status: "NO",
  family_employment: "",
  conflict_firm_name: "",
  conflict_employee_name: "",
  conflict_relationship: "",
  reported_all_income: true,
  margin_account: true,
  data_sharing: true,
)
# u5 = User.create!(first_name: 'Bobby', last_name: 'Lee', email_address: 'bobbobby@email.com', password: 'password', funds: 80, address: "4343 oinun ave", phone_number: 9994440033)

t1 = Transaction.create!(user_id: u4.id, ticker_symbol: "GOOG", transaction_amount: 1000, stock_count: 10, transaction_type: "BUY");
t1 = Transaction.create!(user_id: u4.id, ticker_symbol: "GOOG", transaction_amount: 10000, stock_count: 4, transaction_type: "SELL");
t1 = Transaction.create!(user_id: u4.id, ticker_symbol: "GOOG", transaction_amount: 1000, stock_count: 4, transaction_type: "SELL");
t1 = Transaction.create!(user_id: u4.id, ticker_symbol: "GOOG", transaction_amount: 500, stock_count: 10, transaction_type: "BUY");
t1 = Transaction.create!(user_id: u4.id, ticker_symbol: "GOOG", transaction_amount: 3000, stock_count: 10, transaction_type: "BUY");


w1 = Watchlist.create!(user_id: u4.id, ticker_symbol: "AAPL")
w2 = Watchlist.create!(user_id: u4.id, ticker_symbol: "GOOG")
w3 = Watchlist.create!(user_id: u4.id, ticker_symbol: "TSLA")
w4 = Watchlist.create!(user_id: u4.id, ticker_symbol: "SNAP")
w5 = Watchlist.create!(user_id: u4.id, ticker_symbol: "NFLX")
w6 = Watchlist.create!(user_id: u4.id, ticker_symbol: "META")
w7 = Watchlist.create!(user_id: u4.id, ticker_symbol: "MSFT")
w8 = Watchlist.create!(user_id: u4.id, ticker_symbol: "SBUX")
w9 = Watchlist.create!(user_id: u4.id, ticker_symbol: "AMZN")
w10 = Watchlist.create!(user_id: u4.id, ticker_symbol: "DIS")


