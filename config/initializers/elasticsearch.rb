if Rails.env.production? && ENV['BONSAI_URL'].present?
  Elasticsearch::Client.new(
    url: ENV['BONSAI_URL'],
    transport_options: {
      headers: { 'x-elastic-product' => 'true' }
    }
  )
end