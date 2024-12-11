module Api
  class AuthController < ApplicationController
    include Devise::Controllers::Helpers
    include Devise::Models::DatabaseAuthenticatable

    before_action :authenticate_user!, only: [:current_user]

    def login
      Rails.logger.debug "============ Login Attempt Started ============"
      Rails.logger.debug "Login params: #{login_params.to_h}"

      user = User.find_by(email: login_params[:email])
      Rails.logger.debug "Found user: #{user&.id}"

      if user&.valid_password?(login_params[:password])
        Rails.logger.debug "Password valid for user: #{user.id}"

        # Set remember me
        user.remember_me!
        sign_in(:user, user)

        Rails.logger.debug "User signed in: #{user_signed_in?}"
        Rails.logger.debug "Current user: #{current_user&.id}"
        Rails.logger.debug "Session data: #{session.to_h}"

        render json: {
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email
          }
        }
      else
        Rails.logger.debug "Invalid credentials for user: #{user&.id}"
        render json: { error: "Invalid email or password" }, status: :unauthorized
      end
    end

    def current_user
      Rails.logger.debug "============ Current User Check ============"
      Rails.logger.debug "Session data: #{session.to_h}"
      Rails.logger.debug "Current user: #{current_user&.id}"

      if user_signed_in?
        render json: {
          user: {
            id: current_user.id,
            email: current_user.email
          }
        }
      else
        render json: { error: "Not authenticated" }, status: :unauthorized
      end
    end

    def logout
      Rails.logger.debug "============ Logout Attempt ============"
      Rails.logger.debug "Current user: #{current_user&.id}"
      Rails.logger.debug "Session before logout: #{session.to_h}"

      if current_user
        current_user.forget_me!
        sign_out(current_user)
        reset_session
      end

      Rails.logger.debug "Session after logout: #{session.to_h}"
      render json: { message: "Logged out successfully" }
    end

    private

    def login_params
      params.require(:user).permit(:email, :password)
    end
  end
end