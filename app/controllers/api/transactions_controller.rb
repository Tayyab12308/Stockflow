class Api::TransactionsController < ApplicationController
  before_action :ensure_logged_in?
  
  def create
    @transaction = Transaction.new(transaction_params)
    if @transaction.save
      render json: ["transaction successful"]
    else
      render json: @transaction.errors.full_messages
    end
  end

  private

  def transaction_params
    params.require(:transaction).permit(:user_id, :ticker_symbol, :transaction_amount, :stock_count, :transaction_type)
  end

end