# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  first_name      :string           not null
#  last_name       :string           not null
#  email_address   :string           not null
#  password_digest :string           not null
#  session_token   :string           not null
#  funds           :decimal(10, 2)   not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  address         :string           not null
#  phone_number    :bigint           not null
#  portfolio_value :decimal(10, 2)   not null
#

class User < ApplicationRecord
  validates :first_name, :last_name, :password_digest, :funds, :address, :phone_number, presence: true
  validates :email_address, :session_token, presence: true, uniqueness: true
  validates :password, length: { minimum: 6, allow_nil: true }
  after_initialize :ensure_session_token

  attr_reader :password
  has_many :transactions
  has_many :watchlists

  def self.find_by_credentials(email_address, password)
    user = User.find_by(email_address: email_address)
    user && user.is_password?(password) ? user : nil
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def self.generate_session_token
    SecureRandom::urlsafe_base64
  end

  def ensure_session_token
    self.session_token ||= self.class.generate_session_token
  end

  def reset_session_token!
    self.session_token = self.class.generate_session_token
    self.save!
    self.session_token
  end

  def assign_portfolio_value
    self.portfolio_value = calculate_portfolio_value(0.00)
    self.save!
  end

  def calculate_portfolio_value(amount)
    total_value = amount
    self.transactions.each do |transact|
      if transact.transaction_type == "Buy"
        total_value += transact.transaction_amount
      else
        total_value -= transact.transaction_amount
      end
    end
    total_value
  end

  def assign_funds
    self.funds = calculate_funds(self.funds)
    self.save!
  end

  def calculate_funds(amount)
    total_value = amount
    self.transactions.each do |transact|
      if transact.transaction_type == "Buy"
        total_value -= transact.transaction_amount
      else
        total_value += transact.transaction_amount
      end
    end
  end

  def total_stock_count
    all_stocks = Hash.new(0);
    self.transactions.each do |transact|
      if transact.transaction_type == "Buy"
        debugger
        all_stocks[transact.ticker_symbol] += transact.stock_count 
      else
        all_stocks[transact.ticker_symbol] -= transact.stock_count
      end
    end
    all_stocks
  end

end
