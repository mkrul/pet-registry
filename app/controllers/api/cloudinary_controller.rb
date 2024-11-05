class Api::CloudinaryController < ApplicationController
  def credentials
    render json: {
      cloud_name: Rails.application.credentials.dig(:cloudinary, Rails.env.to_sym, :cloud_name),
      api_key: Rails.application.credentials.dig(:cloudinary, Rails.env.to_sym, :api_key)
    }, status: :ok
  end
end
