module Api
  class SessionsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def create
      Rails.logger.debug "============ Login Attempt Started ============"
      Rails.logger.debug "Login params: #{sign_in_params.to_h}"

      user = User.find_by(email: sign_in_params[:email])
      Rails.logger.debug "Found user: #{user&.id}"

      if user&.valid_password?(sign_in_params[:password])
        Rails.logger.debug "Password valid for user: #{user.id}"

        # Sign in the user and set up session
        warden.set_user(user)
        sign_in(user)
        session[:user_id] = user.id

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
          message: 'Logged in successfully.',
          user: user.as_json(only: [:id, :email])
        }, status: :ok
      else
        Rails.logger.debug "Invalid credentials for user: #{user&.id}"
        render json: { error: 'Invalid email or password.' }, status: :unauthorized
      end
    rescue => e
      Rails.logger.error "Login error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: 'Login failed' }, status: :internal_server_error
    end

    def show
      Rails.logger.debug "============ Current User Check ============"
      Rails.logger.debug "Session data: #{session.to_h}"
      Rails.logger.debug "Remember token cookie: #{cookies.signed[:remember_user_token]}"

      # Try to get user from session first
      current_user = nil

      # Check if we have user ID in session
      if session[:user_id]
        Rails.logger.debug "Found user ID in session: #{session[:user_id]}"
        current_user = User.find_by(id: session[:user_id])
      end

      # If no user in session, try warden
      if !current_user
        Rails.logger.debug "No user in session, checking warden"
        current_user = warden.user(:user)
      end

      # If still no user, try remember token
      if !current_user && cookies.signed[:remember_user_token].present?
        Rails.logger.debug "No user in warden, checking remember token"
        token = cookies.signed[:remember_user_token]
        user_id = token[0][0] if token.is_a?(Array) && token[0].is_a?(Array)
        Rails.logger.debug "User ID from remember token: #{user_id}"

        if user_id
          current_user = User.find_by(id: user_id)
          if current_user
            Rails.logger.debug "Found user from remember token: #{current_user.id}"
            sign_in(:user, current_user)
            session[:user_id] = current_user.id
          end
        end
      end

      if current_user
        Rails.logger.debug "Returning authenticated user: #{current_user.id}"
        render json: {
          user: current_user.as_json(only: [:id, :email])
        }, status: :ok
      else
        Rails.logger.debug "No authenticated user found"
        render json: { error: 'Not authenticated' }, status: :unauthorized
      end
    rescue => e
      Rails.logger.error "Current user check error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: 'Authentication check failed' }, status: :internal_server_error
    end

    def destroy
      Rails.logger.debug "============ Logout Attempt ============"
      Rails.logger.debug "Session before logout: #{session.to_h}"
      Rails.logger.debug "Cookies before logout: #{cookies.to_h}"

      if session[:user_id]
        current_user = User.find_by(id: session[:user_id])
        if current_user&.respond_to?(:forget_me!)
          current_user.forget_me!
        end
      end

      # Clear remember token cookie
      cookies.delete(:remember_user_token, domain: :all)

      # Clear session and sign out
      sign_out(:user)
      reset_session

      Rails.logger.debug "Session after logout: #{session.to_h}"
      Rails.logger.debug "Cookies after logout: #{cookies.to_h}"
      render json: { message: 'Logged out successfully.' }, status: :ok
    rescue => e
      Rails.logger.error "Logout error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: 'Logout failed' }, status: :internal_server_error
    end

    private

    def sign_in_params
      if params[:user]
        params.require(:user).permit(:email, :password)
      elsif params[:session] && params[:session][:user]
        params[:session].require(:user).permit(:email, :password)
      else
        raise ActionController::ParameterMissing.new(:user)
      end
    end

    def warden
      request.env['warden']
    end
  end
end
