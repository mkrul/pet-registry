if Rails.env.production? && ENV['BONSAI_URL'].present?
  Searchkick.client = Elasticsearch::Client.new(
    url: ENV['BONSAI_URL'],
    transport_options: {
      request: {
        headers: {
          'x-elastic-product' => 'true'
        }
      }
    }
  )
end
