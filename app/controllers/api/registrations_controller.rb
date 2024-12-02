module Api
  class RegistrationsController < Devise::RegistrationsController
    respond_to :json
    skip_before_action :verify_authenticity_token

    private

    def respond_with(resource, _opts = {})
      if resource.persisted?
        render json: {
          message: 'Signed up successfully.',
          user: resource.as_json(only: [:id, :email])
        }, status: :ok
      else
        Rails.logger.error("Sign up failed: #{resource.errors.full_messages}")
        render json: {
          message: "Sign up failed.",
          errors: resource.errors.full_messages
        }, status: :unprocessable_entity
      end
    end

    def sign_up_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
  end
end