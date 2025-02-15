class Api::UsersController < ApplicationController

  def create
    if user_params.portfolio_value == nil
      puts "Here"
      puts user_params
      user_params.portfolio_value = user_params.funds
    end

    @user = User.new(user_params)
    if @user.save
      log_in(@user)
      render "api/users/show"
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email_address, :password, :funds, :address, :phone_number, :portfolio_value)
  end
end