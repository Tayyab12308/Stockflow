class Rack::Attack
  # Limit API key token requests
  throttle('req/ip/api/keys/token', limit: 10, period: 1.minute) do |req|
    req.ip if req.path == '/api/keys/token' && req.get?
  end
  
  # Limit API key exchange requests
  throttle('req/ip/api/keys/exchange', limit: 20, period: 1.minute) do |req|
    req.ip if req.path == '/api/keys/exchange' && req.post?
  end
  
  # Block suspicious activity
  blocklist('block suspicious requests') do |req|
    Rack::Attack::Allow2Ban.filter(req.ip, maxretry: 5, findtime: 5.minutes, bantime: 1.hour) do
      req.path =~ /\/(api\/keys)/ && req.env['rack.attack.matched']
    end
  end
end

# Configure Rails to use Rack::Attack
Rails.application.config.middleware.use Rack::Attack