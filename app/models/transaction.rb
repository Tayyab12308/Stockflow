# == Schema Information
#
# Table name: transactions
#
#  id                 :bigint           not null, primary key
#  user_id            :integer          not null
#  ticker_symbol      :string           not null
#  transaction_amount :decimal(10, 2)   not null
#  stock_count        :integer          not null
#  transaction_type   :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class Transaction < ApplicationRecord
  validates :ticker_symbol, presence: true
  validates :transaction_amount, :stock_count, numericality: { greater_than: 0 }
  validates :transaction_type, inclusion: { in: %w(BUY SELL) } 
  validate :valid_sell, :valid_buy
  belongs_to :user
  after_save :portfolio_actions

  def portfolio_actions
    user = self.user
    total_portfolio_value = user.portfolio_value
    total_funds = user.funds
    if self.transaction_type == "BUY"
      total_portfolio_value += transaction_amount
      total_funds -= transaction_amount
    else
      total_portfolio_value -= transaction_amount
      total_funds += transaction_amount
    end
    user.update(portfolio_value: total_portfolio_value, funds: total_funds)
  end

  def valid_sell
    stock_count = self.user.total_stock_count[self.ticker_symbol]
    if self.transaction_type == "SELL" && stock_count - self.stock_count < 0
      errors[:stock_count] << "is not enough to complete transaction"
    end
  end

  def valid_buy
    funds = self.user.funds
    if self.transaction_type == "BUY" && funds < self.transaction_amount
      errors[:transaction_amount] << "is more than your funds"
    end
  end

end
