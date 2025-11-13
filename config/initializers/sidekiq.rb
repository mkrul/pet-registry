# frozen_string_literal: true

if defined?(Sidekiq)
  redis_url = if ENV['REDIS_URL'].present?
    ENV['REDIS_URL'].sub(%r{/\d+$}, '/0')
  else
    'redis://localhost:6379/0'
  end

  Sidekiq.configure_server do |config|
    config.redis = { url: redis_url }
  end

  Sidekiq.configure_client do |config|
    config.redis = { url: redis_url }
  end
end

