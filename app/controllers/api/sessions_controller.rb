module Api
  class SessionsController < Devise::SessionsController
    respond_to :json
    skip_before_action :verify_authenticity_token
    skip_before_action :require_no_authentication
    before_action :configure_permitted_parameters

    def create
      Rails.logger.debug "============ Login Attempt Started ============"
      Rails.logger.debug "Login params: #{sign_in_params.to_h}"
      Rails.logger.debug "Session before login: #{session.to_h}"

      self.resource = warden.authenticate!(auth_options)
      Rails.logger.debug "User authenticated: #{resource.id}"

      sign_in(resource_name, resource)
      Rails.logger.debug "User signed in via Devise"
      Rails.logger.debug "Session after sign_in: #{session.to_h}"

      respond_to do |format|
        format.json {
          render json: {
            message: 'Logged in successfully.',
            user: UserSerializer.new(resource).as_json
          }, status: :ok
        }
      end
    rescue => e
      Rails.logger.error "Login error occurred: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      respond_to do |format|
        format.json {
          render json: { message: 'Invalid email or password.' }, status: :unauthorized
        }
      end
    ensure
      Rails.logger.debug "============ Login Attempt Completed ============"
    end

    def destroy
      Rails.logger.debug "============ Logout Attempt Started ============"
      Rails.logger.debug "Current user before logout: #{current_user&.id}"
      Rails.logger.debug "Session before logout: #{session.to_h}"

      signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
      Rails.logger.debug "Signed out successfully: #{signed_out}"
      Rails.logger.debug "Session after logout: #{session.to_h}"

      respond_to do |format|
        format.json {
          render json: { message: 'Logged out successfully.' }, status: :ok
        }
      end
    rescue => e
      Rails.logger.error "Logout error occurred: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      respond_to do |format|
        format.json {
          render json: { message: 'An error occurred during logout.' }, status: :unauthorized
        }
      end
    ensure
      Rails.logger.debug "============ Logout Attempt Completed ============"
    end

    protected

    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
    end

    private

    def sign_in_params
      params.require(:user).permit(:email, :password)
    end

    def respond_to_on_destroy
      head :no_content
    end
  end
end
