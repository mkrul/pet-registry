module Api
  class SessionsController < Devise::SessionsController
    skip_before_action :verify_authenticity_token
    respond_to :json

    private

    def respond_with(resource, _opts = {})
      Rails.logger.debug "Login successful for user: #{resource.email}"
      render json: {
        status: { code: 200, message: 'Logged in successfully.' },
        data: UserSerializer.new(resource).as_json
      }
    end

    def respond_to_on_destroy
      Rails.logger.debug "Logout attempt for user: #{current_user&.email}"
      if current_user
        current_user.update(jti: SecureRandom.uuid)
        render json: {
          status: { code: 200, message: 'Logged out successfully.' }
        }
      else
        render json: {
          status: { code: 401, message: 'Couldn\'t find an active session.' }
        }, status: :unauthorized
      end
    end
  end
end