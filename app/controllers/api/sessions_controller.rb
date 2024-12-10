module Api
  class SessionsController < Devise::SessionsController
    respond_to :json
    skip_before_action :verify_authenticity_token

    def create
      Rails.logger.debug "============ Login Attempt Started ============"
      Rails.logger.debug "Login params: #{sign_in_params.to_h}"
      Rails.logger.debug "Session before login: #{session.to_h}"

      self.resource = warden.authenticate!(auth_options)
      Rails.logger.debug "User authenticated: #{resource.id}"

      if resource
        resource.remember_me!
        sign_in(resource_name, resource)

        Rails.logger.debug "Session after sign in: #{session.to_h}"
        Rails.logger.debug "Current user: #{current_user&.id}"
        Rails.logger.debug "User signed in?: #{user_signed_in?}"

        render json: {
          message: 'Logged in successfully.',
          user: UserSerializer.new(resource).as_json
        }, status: :ok
      else
        render json: { error: 'Invalid email or password.' }, status: :unauthorized
      end
    end

    def destroy
      Rails.logger.debug "============ Logout Attempt Started ============"
      Rails.logger.debug "Current user before logout: #{current_user&.id}"

      if current_user
        current_user.forget_me!
        sign_out(current_user)
        reset_session
      end

      Rails.logger.debug "Session after logout: #{session.to_h}"
      render json: { message: 'Logged out successfully.' }, status: :ok
    end

    private

    def sign_in_params
      params.require(:user).permit(:email, :password)
    end

    def auth_options
      { scope: :user }
    end
  end
end
