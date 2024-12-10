module Api
  class SessionsController < Devise::SessionsController
    respond_to :json
    skip_before_action :verify_authenticity_token
    before_action :configure_permitted_parameters

    def create
      Rails.logger.debug "============ Login Attempt Started ============"
      Rails.logger.debug "Login params: #{sign_in_params.to_h}"
      Rails.logger.debug "Session before login: #{session.to_h}"
      Rails.logger.debug "Warden: #{warden.inspect}"

      begin
        user = User.find_by(email: sign_in_params[:email])
        Rails.logger.debug "Found user: #{user&.id}"

        if user&.valid_password?(sign_in_params[:password])
          Rails.logger.debug "Password valid for user: #{user.id}"
          sign_in(:user, user)
          Rails.logger.debug "User signed in via Devise"
          Rails.logger.debug "Session after sign_in: #{session.to_h}"
          Rails.logger.debug "Current user: #{current_user&.id}"
          Rails.logger.debug "User signed in?: #{user_signed_in?}"

          render json: {
            message: 'Logged in successfully.',
            user: UserSerializer.new(user).as_json
          }, status: :ok
        else
          Rails.logger.debug "Invalid password for user: #{user&.id}"
          render json: { message: 'Invalid email or password.' }, status: :unauthorized
        end
      rescue => e
        Rails.logger.error "Login error occurred: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        render json: { message: 'Invalid email or password.' }, status: :unauthorized
      end
    end

    def destroy
      Rails.logger.debug "============ Logout Attempt Started ============"
      Rails.logger.debug "Current user before logout: #{current_user&.id}"
      Rails.logger.debug "Session before logout: #{session.to_h}"

      sign_out(current_user)
      reset_session

      Rails.logger.debug "Signed out successfully"
      Rails.logger.debug "Session after logout: #{session.to_h}"

      render json: { message: 'Logged out successfully.' }, status: :ok
    rescue => e
      Rails.logger.error "Logout error occurred: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { message: 'An error occurred during logout.' }, status: :unauthorized
    end

    protected

    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
    end

    private

    def sign_in_params
      params.require(:user).permit(:email, :password)
    end

    def auth_options
      { scope: :user }
    end

    def resource_name
      :user
    end

    def devise_mapping
      @devise_mapping ||= Devise.mappings[:user]
    end

    def warden
      request.env['warden']
    end
  end
end
