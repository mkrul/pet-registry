module Api
  class RegistrationsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def create
      Rails.logger.debug "============ Registration Attempt Started ============"
      Rails.logger.debug "Registration params: #{sign_up_params.to_h}"

      user = User.new(sign_up_params)
      Rails.logger.debug "User built: #{user.inspect}"

      if user.save
        Rails.logger.debug "User saved successfully: #{user.id}"

        # Sign in the user and set up session
        warden.set_user(user)
        sign_in(user)

        # Set remember me token
        if user.respond_to?(:remember_me!) && Devise.respond_to?(:remember_for)
          user.remember_me!
          cookies.signed[:remember_user_token] = {
            value: user.class.serialize_into_cookie(user),
            expires: Devise.remember_for.from_now,
            httponly: true
          }
        end

        Rails.logger.debug "Warden user: #{warden.user.inspect}"
        Rails.logger.debug "Session data: #{session.to_h}"
        Rails.logger.debug "Cookies: #{cookies.to_h}"

        render json: {
          message: 'Signed up successfully.',
          user: user.as_json(only: [:id, :email])
        }, status: :ok
      else
        Rails.logger.error("Sign up failed: #{user.errors.full_messages}")
        render json: {
          message: "Sign up failed.",
          errors: user.errors.full_messages
        }, status: :unprocessable_entity
      end
    rescue => e
      Rails.logger.error "Registration error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: 'Registration failed' }, status: :internal_server_error
    end

    private

    def sign_up_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end

    def warden
      request.env['warden']
    end
  end
end