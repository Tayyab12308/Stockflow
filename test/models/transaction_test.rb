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

require 'test_helper'

class TransactionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
