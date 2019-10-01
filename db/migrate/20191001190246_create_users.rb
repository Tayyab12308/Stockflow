class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email_address, null: false
      t.string :password_digest, null: false
      t.string :session_token, null: false
      t.decimal :funds, precision: 10, scale: 2, null: false
      t.timestamps
    end
    add_index :users, :id
    add_index :users, :first_name
    add_index :users, :last_name
    add_index :users, :email_address, unique: true
    add_index :users, :session_token, unique: true
  end
end
