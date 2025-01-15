Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    protocol = Rails.application.credentials.dig(:domain, Rails.env.to_sym, :protocol)
    second_level = Rails.application.credentials.dig(:domain, Rails.env.to_sym, :second_level)
    top_level = Rails.application.credentials.dig(:domain, Rails.env.to_sym, :top_level)
    production_url = "#{protocol}://#{second_level}.#{top_level}"

    origins "#{production_url},http://localhost:3000,http://127.0.0.1:3000"

    resource "*",
      headers: :any,
      expose: ['Set-Cookie', 'Authorization'],
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      max_age: 86400
  end
end