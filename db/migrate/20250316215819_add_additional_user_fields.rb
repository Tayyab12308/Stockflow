class AddAdditionalUserFields < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :additional_address,           :string
    add_column :users, :city,                         :string, null: false, default: ""
    add_column :users, :state,                        :string, null: false, default: ""
    add_column :users, :zip_code,                     :string, null: false, default: ""
    add_column :users, :social_security_number,       :string, null: false, default: ""
    add_column :users, :date_of_birth,                :string, null: false, default: ""
    add_column :users, :citizenship,                  :string, null: false, default: ""
    add_column :users, :investing_experience,         :string, null: false, default: ""
    add_column :users, :options_trading_preference,   :string, null: false, default: ""
    add_column :users, :employment_status,            :string, null: false, default: ""
    add_column :users, :salary_range,                 :string, null: false, default: ""
    add_column :users, :job_address,                  :string
    add_column :users, :job_additional_address,       :string
    add_column :users, :job_city,                     :string
    add_column :users, :job_state,                    :string
    add_column :users, :job_zip_code,                 :string
    add_column :users, :employer_name,                :string
    add_column :users, :employment_conflict,          :string, null: false, default: ""
    add_column :users, :job_description,              :string
    add_column :users, :job_industry,                 :string
    add_column :users, :family_status,                :string, null: false, default: ""
    add_column :users, :family_employment,            :string
    add_column :users, :conflict_firm_name,           :string
    add_column :users, :conflict_employee_name,       :string
    add_column :users, :conflict_relationship,        :string
    add_column :users, :reported_all_income,          :boolean, null: false, default: true
    add_column :users, :margin_account,               :boolean, null: false, default: true
    add_column :users, :data_sharing,                 :boolean, null: false, default: true 
  end
end