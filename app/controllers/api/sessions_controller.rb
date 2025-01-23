module Api
  class SessionsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def create
      user = User.find_by(email: sign_in_params[:email])

      if user&.valid_password?(sign_in_params[:password])
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

        render json: {
          message: 'Logged in successfully.',
          user: user.as_json(only: [:id, :email])
        }, status: :ok
      else
        render json: { message: 'Invalid email or password.' }, status: :unauthorized
      end
    rescue => e
      render json: { message: 'Login failed' }, status: :internal_server_error
    end

    def show
      # Try to get user from session first
      current_user = nil

      # Check if we have user data in session
      if session["warden.user..key"].is_a?(Hash) && session["warden.user..key"]["id"]
        current_user = User.find_by(id: session["warden.user..key"]["id"])
      end

      # If no user in session, try warden
      if !current_user
        current_user = warden.user
      end

      # If still no user, try remember token
      if !current_user && cookies.signed[:remember_user_token].present?
        token = cookies.signed[:remember_user_token]
        user_id = token[0][0] if token.is_a?(Array) && token[0].is_a?(Array)

        if user_id
          current_user = User.find_by(id: user_id)
          if current_user
            sign_in(current_user)
            warden.set_user(current_user)
          end
        end
      end

      if current_user
        render json: {
          user: current_user.as_json(only: [:id, :email])
        }, status: :ok
      else
        render json: { message: 'Not authenticated' }, status: :unauthorized
      end
    rescue StandardError => e
      render json: { message: 'Authentication check failed' }, status: :internal_server_error
    end

    def destroy
      # Get current user from session hash if it exists
      user_data = session["warden.user..key"]
      if user_data.is_a?(Hash) && user_data["id"]
        current_user = User.find_by(id: user_data["id"])
        if current_user&.respond_to?(:forget_me!)
          current_user.forget_me!
        end
      end

      # Clear remember token cookie
      cookies.delete(:remember_user_token, domain: :all)

      # Clear session and sign out
      sign_out(:user)
      reset_session

      render json: { message: 'Logged out successfully.' }, status: :ok
    rescue => e
      render json: { message: 'Logout failed' }, status: :internal_server_error
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
