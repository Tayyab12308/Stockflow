export interface BackendUserResponse {
  user: any;
  data: BackendUser;
}

export interface BackendUser {
  id: number;
  first_name: string;
  last_name: string;
  email_address: string;
  password: string;
  phone_number: string;
  address: string;
  additional_address: string;
  city: string;
  state: string;
  zip_code: string;
  social_security_number: string;
  date_of_birth: string;
  citizenship: string;
  investing_experience: string;
  options_trading_preference: string;
  employment_status: string;
  salary_range: string;
  employer_name: string;
  job_description: string;
  job_industry: string;
  job_address: string;
  job_additional_address: string;
  job_city: string;
  job_state: string;
  job_zip_code: string;
  family_status: string;
  family_employment: string;
  employment_conflict: string;
  conflict_firm_name: string;
  conflict_employee_name: string;
  conflict_relationship: string;
  reported_all_income: boolean;
  margin_account: boolean;
  data_sharing: boolean;
  funds: string;
  portfolio_value: string;
  transactions: BackendTransactionResponse[];
  watchlist: BackendWatchListResponse[];
  total_stock_count: Record<string, number>;
}

export interface BackendTransactionResponse {
  created_at: string;
  id: number;
  ticker_symbol: string;
  transaction_amount: string;
  transaction_type: string;
}

export interface BackendWatchListResponse {
  id: number;
  ticker_symbol: string;
}
