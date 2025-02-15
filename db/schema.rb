# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2019_10_11_020117) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "transactions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "ticker_symbol", null: false
    t.decimal "transaction_amount", precision: 10, scale: 2, null: false
    t.integer "stock_count", null: false
    t.string "transaction_type", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["ticker_symbol"], name: "index_transactions_on_ticker_symbol"
    t.index ["user_id"], name: "index_transactions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "email_address", null: false
    t.string "password_digest", null: false
    t.string "session_token", null: false
    t.decimal "funds", precision: 10, scale: 2, null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "address", null: false
    t.bigint "phone_number", null: false
    t.decimal "portfolio_value", precision: 10, scale: 2, null: false
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
    t.index ["first_name"], name: "index_users_on_first_name"
    t.index ["id"], name: "index_users_on_id"
    t.index ["last_name"], name: "index_users_on_last_name"
    t.index ["session_token"], name: "index_users_on_session_token", unique: true
  end

  create_table "watchlists", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "ticker_symbol", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["id"], name: "index_watchlists_on_id"
    t.index ["ticker_symbol"], name: "index_watchlists_on_ticker_symbol"
    t.index ["user_id"], name: "index_watchlists_on_user_id"
  end
end
