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
  validates :ticker_symbol, :stock_count, :transaction_type, presence: true
  belongs_to :user
end
