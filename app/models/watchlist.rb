# == Schema Information
#
# Table name: watchlists
#
#  id            :bigint           not null, primary key
#  user_id       :integer          not null
#  ticker_symbol :integer          not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class Watchlist < ApplicationRecord
  validates :ticker_symbol, presence: true
  belongs_to :user
end
