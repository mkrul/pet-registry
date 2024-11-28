# app/controllers/api/config_controller.rb

module Api
  class ConfigController < ApplicationController
    def google_client_id
      render json: { client_id: Rails.application.credentials.google_oauth[:client_id] }, status: :ok
    end
  end
end
