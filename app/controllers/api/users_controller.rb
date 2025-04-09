class Api::UsersController < ApplicationController

  def create
    @user = User.new(user_params)
    if @user.save
      log_in(@user)
      render :show, formats: :json
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def current
    puts("fetching current user")
    if current_user
      puts("current user found")
      puts(current_user)
      render :current, locals: { user: current_user }
    else
      render json: { logged_in: false }, status: :unauthorized
    end
  end

  private

  def user_params
    params.require(:user)
    .permit(
      :first_name,
      :last_name,
      :email_address,
      :password,
      :funds,
      :address,
      :phone_number,
      :portfolio_value,
      :additional_address,
      :city,
      :state,
      :zip_code,
      :social_security_number,
      :date_of_birth,
      :citizenship,
      :investing_experience,
      :options_trading_preference,
      :employment_status,
      :salary_range,
      :job_address,
      :job_additional_address,
      :job_city,
      :job_state,
      :job_zip_code,
      :employer_name,
      :employment_conflict,
      :job_description,
      :job_industry,
      :family_status,
      :family_employment,
      :conflict_firm_name,
      :conflict_employee_name,
      :conflict_relationship,
      :reported_all_income,
      :margin_account,
      :data_sharing,
    )
    .to_h
  end
end