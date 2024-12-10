module Api
  class RegistrationsController < Devise::RegistrationsController
    respond_to :json
    skip_before_action :verify_authenticity_token
    before_action :configure_sign_up_params, only: [:create]

    def create
      Rails.logger.debug "============ Registration Attempt Started ============"
      Rails.logger.debug "Raw params: #{params.to_unsafe_h}"
      Rails.logger.debug "User params: #{sign_up_params}"
      Rails.logger.debug "Session before registration: #{session.to_h}"
      Rails.logger.debug "Request format: #{request.format}"
      Rails.logger.debug "Content-Type: #{request.content_type}"

      build_resource(sign_up_params)
      Rails.logger.debug "Resource built with params: #{sign_up_params}"
      Rails.logger.debug "Resource valid? #{resource.valid?}"
      Rails.logger.debug "Resource errors: #{resource.errors.full_messages}" if resource.errors.any?

      resource.save
      yield resource if block_given?

      if resource.persisted?
        Rails.logger.debug "User saved successfully with id: #{resource.id}"

        if resource.active_for_authentication?
          Rails.logger.debug "User is active for authentication"
          sign_up(resource_name, resource)
          Rails.logger.debug "User signed up and signed in"
          Rails.logger.debug "Session after sign up: #{session.to_h}"

          render json: {
            message: 'Signed up successfully.',
            user: UserSerializer.new(resource).as_json
          }, status: :ok
        else
          Rails.logger.debug "User is not active for authentication"
          expire_data_after_sign_in!
          render json: {
            message: "Signed up but #{resource.inactive_message}",
            user: UserSerializer.new(resource).as_json
          }, status: :ok
        end
      else
        Rails.logger.error "Registration failed: #{resource.errors.full_messages}"
        clean_up_passwords resource
        set_minimum_password_length
        render json: {
          message: "Sign up failed.",
          errors: resource.errors.full_messages
        }, status: :unprocessable_entity
      end
    rescue => e
      Rails.logger.error "Registration error occurred: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: {
        message: "An error occurred during registration.",
        error: e.message
      }, status: :unprocessable_entity
    ensure
      Rails.logger.debug "============ Registration Attempt Completed ============"
    end

    protected

    def configure_sign_up_params
      devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation])
    end

    private

    def sign_up_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
  end
end