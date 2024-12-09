module Api
  class RegistrationsController < Devise::RegistrationsController
    skip_before_action :verify_authenticity_token
    respond_to :json

    private

    def respond_with(resource, _opts = {})
      Rails.logger.debug "Registration attempt for: #{resource.email}"
      if resource.persisted?
        Rails.logger.debug "Registration successful for: #{resource.email}"
        render json: {
          status: { code: 200, message: 'Signed up successfully.' },
          data: UserSerializer.new(resource).as_json
        }
      else
        Rails.logger.debug "Registration failed for: #{resource.email}, errors: #{resource.errors.full_messages}"
        render json: {
          status: {
            message: "User couldn't be created",
            errors: resource.errors.full_messages
          }
        }, status: :unprocessable_entity
      end
    end

    def sign_up_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
  end
end