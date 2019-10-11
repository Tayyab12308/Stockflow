class CreateTransactions < ActiveRecord::Migration[5.2]
  def change
    create_table :transactions do |t|
      t.integer :user_id, null: false
      t.string :ticker_symbol, null: false
      t.decimal :transaction_amount, precision: 10, scale: 2, null: false
      t.integer :stock_count, null: false
      t.string :transaction_type, null: false
      t.timestamps
    end
    add_index :transactions, :user_id
    add_index :transactions, :ticker_symbol
  end
end
