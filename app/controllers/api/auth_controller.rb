module Api
  class AuthController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :authenticate_user!, only: [:authenticated_user]

    def authenticated_user
      Rails.logger.debug "============ Checking Authentication Status ============"
      Rails.logger.debug "Current user: #{current_user&.id}"
      Rails.logger.debug "Session data: #{session.to_h}"
      Rails.logger.debug "Warden authenticated?: #{warden.authenticated?(:user)}"
      Rails.logger.debug "User signed in?: #{user_signed_in?}"

      if user_signed_in?
        Rails.logger.debug "User is authenticated, returning user data"
        render json: {
          user: UserSerializer.new(current_user).as_json
        }, status: :ok
      else
        Rails.logger.debug "No authenticated user found"
        render json: { user: nil }, status: :ok
      end
    rescue => e
      Rails.logger.error "Error checking authentication status: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: "Authentication check failed" }, status: :internal_server_error
    end

    private

    def warden
      request.env['warden']
    end

    def auth_options
      { scope: :user }
    end
  end
end