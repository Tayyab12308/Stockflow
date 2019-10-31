class Api::TransactionsController < ApplicationController
  before_action :ensure_logged_in?
  
  def create
    transaction = Transaction.new(transaction_params)
    transaction.user_id = current_user.id
    if transaction.save
      @user = User.find(current_user.id)
      render "api/users/show"
    else
      render json: transaction.errors.full_messages
    end
  end

  private

  def transaction_params
    params.require(:transaction).permit(:ticker_symbol, :transaction_amount, :stock_count, :transaction_type)
  end

end