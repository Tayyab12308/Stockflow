require 'redis'
require 'redis-namespace'
require 'connection_pool'

redis_url = ENV.fetch('REDIS_URL', 'redis://localhost:6379/0')
pool_size = ENV.fetch('REDIS_POOL_SIZE', 5).to_i
pool_timeout = ENV.fetch('REDIS_POOL_TIMEOUT', 5).to_i

# Create a connection pool for Redis
REDIS_POOL = ConnectionPool.new(size: pool_size, timeout: pool_timeout) do
  Redis.new(url: redis_url)
end

# Create a dedicated logger for API key access
logfile = Rails.root.join('log', "api_key_access_#{Rails.env}.log")
API_KEY_LOGGER = Logger.new(logfile, 'daily')
API_KEY_LOGGER.formatter = proc do |severity, datetime, progname, msg|
  "[#{datetime.strftime('%Y-%m-%d %H:%M:%S')}] #{severity}: #{msg}\n"
end