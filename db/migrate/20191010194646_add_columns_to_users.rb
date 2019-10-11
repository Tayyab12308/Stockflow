class AddColumnsToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :address, :string, null: false
    add_column :users, :phone_number, :bigInt, null: false
    add_column :users, :portfolio_value, :decimal, precision: 10, scale: 2, null: false
  end
end
