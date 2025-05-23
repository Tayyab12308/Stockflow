class Api::SessionsController < ApplicationController

  def create
    @user = User.find_by_credentials(params[:user][:email_address], params[:user][:password])
    if @user
      log_in(@user)
      render "api/users/current", locals: { user: current_user }
    else
      render json: ["Invalid Username or Password"], status: 422
    end
  end

  def destroy
    if logged_in?
      log_out
      render json: {}
    else
      render json: ["No user signed in"], status: 422
    end
  end

end