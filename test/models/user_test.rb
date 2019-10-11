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

require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
