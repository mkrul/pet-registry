Cloudinary.config do |config|
  config.cloud_name = Rails.application.credentials.dig(Rails.env.to_sym, :cloudinary, :cloud_name)
  config.api_key = Rails.application.credentials.dig(Rails.env.to_sym, :cloudinary, :api_key)
  config.api_secret = Rails.application.credentials.dig(Rails.env.to_sym, :cloudinary, :api_secret)
end
