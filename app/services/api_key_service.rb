class ApiKeyService
  def self.polygon_api_key
    Rails.application.credentials.dig(:polygon, :api_key)
  end
  
  def self.fin_model_prep_api_key_one
    Rails.application.credentials.dig(:finModelPrep, :api_key_one)
  end

  def self.fin_model_prep_api_key_two
    Rails.application.credentials.dig(:finModelPrep, :api_key_two)
  end

  def self.fin_model_prep_api_key_three
    Rails.application.credentials.dig(:finModelPrep, :api_key_three)
  end

  def self.fin_model_prep_api_key_four
    Rails.application.credentials.dig(:finModelPrep, :api_key_four)
  end

  def self.fin_model_prep_api_key_five
    Rails.application.credentials.dig(:finModelPrep, :api_key_five)
  end

  def self.fin_model_prep_api_key_six
    Rails.application.credentials.dig(:finModelPrep, :api_key_six)
  end

  def self.fin_model_prep_api_key_seven
    Rails.application.credentials.dig(:finModelPrep, :api_key_seven)
  end

  def self.fin_model_prep_api_key_eight
    Rails.application.credentials.dig(:finModelPrep, :api_key_eight)
  end

  def self.fin_model_prep_api_key_nine
    Rails.application.credentials.dig(:finModelPrep, :api_key_nine)
  end

  def self.alphavantage_api_key_one
    Rails.application.credentials.dig(:alphavantage, :api_key_one)
  end

  def self.alphavantage_api_key_two
    Rails.application.credentials.dig(:alphavantage, :api_key_two)
  end

  def self.alphavantage_api_key_three
    Rails.application.credentials.dig(:alphavantage, :api_key_three)
  end

  def self.alphavantage_api_key_four
    Rails.application.credentials.dig(:alphavantage, :api_key_four)
  end

  def self.alphavantage_api_key_five
    Rails.application.credentials.dig(:alphavantage, :api_key_five)
  end

  def self.alphavantage_api_key_six
    Rails.application.credentials.dig(:alphavantage, :api_key_six)
  end

  def self.alphavantage_api_key_seven
    Rails.application.credentials.dig(:alphavantage, :api_key_seven)
  end

  def self.alphavantage_api_key_eight
    Rails.application.credentials.dig(:alphavantage, :api_key_eight)
  end

  def self.alphavantage_api_key_nine
    Rails.application.credentials.dig(:alphavantage, :api_key_nine)
  end

  def self.alphavantage_api_key_ten
    Rails.application.credentials.dig(:alphavantage, :api_key_ten)
  end
end