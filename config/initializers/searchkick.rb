# Configure Searchkick client based on environment
if Rails.env.production? && Rails.application.credentials.dig(Rails.env.to_sym, :bonsai, :url).present?
  Searchkick.client = Elasticsearch::Client.new(url: Rails.application.credentials.dig(Rails.env.to_sym, :bonsai, :url))
elsif Rails.application.credentials.dig(Rails.env.to_sym, :elasticsearch, :url).present?
  # Use Elasticsearch client from credentials
  Searchkick.client = Elasticsearch::Client.new(url: Rails.application.credentials.dig(Rails.env.to_sym, :elasticsearch, :url))
else
  # Default to Elasticsearch for development
  Searchkick.client = Elasticsearch::Client.new(url: ENV['ELASTICSEARCH_URL'] || 'http://localhost:9200')
end

