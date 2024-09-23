class Api::CloudinaryController < ApplicationController
  def credentials
    render json: {
      cloud_name: Rails.application.credentials.cloudinary[:cloud_name],
      api_key: Rails.application.credentials.cloudinary[:api_key]
    }, status: :ok
  end
end
