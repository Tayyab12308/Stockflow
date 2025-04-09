class Api::HealthController < ApplicationController
  def redis
    begin
      REDIS_POOL.with do |redis|
        namespace = Redis::Namespace.new('health', redis: redis)
        namespace.setex('check', 5, 'OK')
        value = namespace.get('check')
        
        if value == 'OK'
          render json: { status: 'ok', message: 'Redis connection successful' }
        else
          render json: { status: 'error', message: 'Redis test failed' }, status: :service_unavailable
        end
      end
    rescue => e
      render json: { status: 'error', message: "Redis connection failed: #{e.message}" }, status: :service_unavailable
    end
  end
end