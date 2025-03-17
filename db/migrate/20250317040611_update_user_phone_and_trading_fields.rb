class UpdateUserPhoneAndTradingFields < ActiveRecord::Migration[7.2]
  def up
    # Change phone_number from bigint to string
    change_column :users, :phone_number, :string

    # Allow NULL values for options_trading_preference
    change_column_null :users, :options_trading_preference, true
  end

  def down
    # Revert phone_number to bigint (may fail if string values exist)
    change_column :users, :phone_number, :bigint, using: 'phone_number::bigint'

    # Revert options_trading_preference to NOT NULL
    change_column_null :users, :options_trading_preference, false
  end
end
