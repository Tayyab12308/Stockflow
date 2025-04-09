# app/controllers/api/keys_controller.rb
class Api::KeysController < ApplicationController
  protect_from_forgery with: :exception
  before_action :ensure_logged_in?
  before_action :validate_origin
  
  # Generate a temporary token
  def token
    # Log token generation (without the token itself)
    API_KEY_LOGGER.info("Token requested by User ##{current_user.id} from IP #{request.remote_ip}")
    
    temp_token = SecureRandom.hex(24)
    expiry = 5.minutes.from_now.to_i
    
    token_data = {
      user_id: current_user.id,
      ip: request.remote_ip,
      user_agent: request.user_agent,
      created_at: Time.now.to_i,
      expires_at: expiry
    }
    
    # Store the token in Redis with expiration
    REDIS_POOL.with do |redis|
      namespace = Redis::Namespace.new('api_keys', redis: redis)
      namespace.setex(temp_token, 5.minutes.to_i, token_data.to_json)
    end
    
    render json: { 
      token: temp_token, 
      expires_at: expiry
    }
  end
  
  # Exchange token for API keys
  def exchange
    API_KEY_LOGGER.info("Token exchange attempt by User ##{current_user.id} from IP #{request.remote_ip}")
    
    token = request.headers['X-API-Token']
    
    if token.blank?
      API_KEY_LOGGER.warn("Missing token in request from User ##{current_user.id}, IP #{request.remote_ip}")
      return render json: { error: 'Missing token' }, status: :bad_request
    end
    
    # Get token data from Redis
    token_data_json = nil
    REDIS_POOL.with do |redis|
      namespace = Redis::Namespace.new('api_keys', redis: redis)
      token_data_json = namespace.get(token)
    end
    
    if token_data_json.nil?
      API_KEY_LOGGER.warn("Invalid or expired token used by User ##{current_user.id}, IP #{request.remote_ip}")
      return render json: { error: 'Invalid or expired token' }, status: :unauthorized
    end
    
    token_data = JSON.parse(token_data_json, symbolize_names: true)
    
    # Validate token data
    unless valid_token_data?(token_data)
      API_KEY_LOGGER.warn("Token validation failed for User ##{current_user.id}, IP #{request.remote_ip}")
      
      REDIS_POOL.with do |redis|
        namespace = Redis::Namespace.new('api_keys', redis: redis)
        namespace.del(token) # Delete invalid token
      end
      
      return render json: { error: 'Token validation failed' }, status: :unauthorized
    end
    
    # Delete the token immediately after use (one-time use)
    REDIS_POOL.with do |redis|
      namespace = Redis::Namespace.new('api_keys', redis: redis)
      namespace.del(token)
    end
    
    API_KEY_LOGGER.info("Successful API key exchange for User ##{current_user.id}")
    
    # Return the actual API keys
    render json: {
      polygon_api_key: ApiKeyService.polygon_api_key,
      fin_model_prep_api_key_one: ApiKeyService.fin_model_prep_api_key_one,
      fin_model_prep_api_key_two: ApiKeyService.fin_model_prep_api_key_two,
      fin_model_prep_api_key_three: ApiKeyService.fin_model_prep_api_key_three,
      fin_model_prep_api_key_four: ApiKeyService.fin_model_prep_api_key_four,
      fin_model_prep_api_key_five: ApiKeyService.fin_model_prep_api_key_five,
      fin_model_prep_api_key_six: ApiKeyService.fin_model_prep_api_key_six,
      fin_model_prep_api_key_seven: ApiKeyService.fin_model_prep_api_key_seven,
      fin_model_prep_api_key_eight: ApiKeyService.fin_model_prep_api_key_eight,
      fin_model_prep_api_key_nine: ApiKeyService.fin_model_prep_api_key_nine,
      alphavantage_api_key_one: ApiKeyService.alphavantage_api_key_one,
      alphavantage_api_key_two: ApiKeyService.alphavantage_api_key_two,
      alphavantage_api_key_three: ApiKeyService.alphavantage_api_key_three,
      alphavantage_api_key_four: ApiKeyService.alphavantage_api_key_four,
      alphavantage_api_key_five: ApiKeyService.alphavantage_api_key_five,
      alphavantage_api_key_six: ApiKeyService.alphavantage_api_key_six,
      alphavantage_api_key_seven: ApiKeyService.alphavantage_api_key_seven,
      alphavantage_api_key_eight: ApiKeyService.alphavantage_api_key_eight,
      alphavantage_api_key_nine: ApiKeyService.alphavantage_api_key_nine,
      alphavantage_api_key_ten: ApiKeyService.alphavantage_api_key_ten,
    }
  end
  
  private
  
  def validate_origin
    # Allow same-origin requests
    allowed_origins = [
      "#{request.protocol}#{request.host_with_port}"
    ]
    
    # Add production domains
    if Rails.env.production?
      allowed_origins << 'https://stockflow.dev'
    end
    
    request_origin = request.headers['Origin']
    
    # Skip for same-origin requests without Origin header
    return if request_origin.blank? && request.headers['Referer']&.start_with?("#{request.protocol}#{request.host}")
    
    unless allowed_origins.include?(request_origin) || Rails.env.development?
      API_KEY_LOGGER.warn("Blocked API key request from origin: #{request_origin}, IP: #{request.remote_ip}")
      render json: { error: 'Forbidden origin' }, status: :forbidden
    end
  end
  
  def valid_token_data?(token_data)
    # Check user ID matches
    return false unless token_data[:user_id] == current_user.id
    
    # Check IP address matches (with potential allowance for proxies in production)
    return false unless token_data[:ip] == request.remote_ip
    
    # Check user agent matches
    return false unless token_data[:user_agent] == request.user_agent
    
    # Check if token is expired
    return false if Time.now.to_i > token_data[:expires_at]
    
    true
  end
end