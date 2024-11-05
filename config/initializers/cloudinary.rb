Cloudinary.config do |config|
  config.cloud_name = Rails.application.credentials.dig(:cloudinary, Rails.env.to_sym, :cloud_name)
  config.api_key = Rails.application.credentials.dig(:cloudinary, Rails.env.to_sym, :api_key)
  config.api_secret = Rails.application.credentials.dig(:cloudinary, Rails.env.to_sym, :api_secret)
end
