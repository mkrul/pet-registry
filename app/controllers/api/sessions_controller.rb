module Api
  class SessionsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def create
      if request.content_type != 'application/json'
        return render json: { error: 'Invalid content type' }, status: :bad_request
      end

      user_params = sign_in_params
      unless user_params
        return render json: { error: 'Missing user parameters' }, status: :bad_request
      end

      # Use case-insensitive email lookup
      email = user_params[:email]&.downcase
      user = User.where('lower(email) = ?', email).first

      if user&.valid_password?(user_params[:password])
        sign_in(user)
        session[:user_id] = user.id
        # Update last activity timestamp
        session[:last_activity] = Time.current.to_i

        if user.respond_to?(:remember_me!) && Devise.respond_to?(:remember_for)
          user.remember_me!
          cookies[:remember_user_token] = {
            value: user.class.serialize_into_cookie(user),
            expires: Devise.remember_for.from_now,
            httponly: true,
            secure: Rails.env.production?,
            same_site: :lax,
            domain: Rails.application.credentials.dig(:domain, Rails.env.to_sym, :url) || :all
          }
        end

        render json: {
          message: 'Logged in successfully',
          user: user.as_json(only: [:id, :email])
        }, status: :ok
      else
        render json: { message: 'Invalid email or password.' }, status: :unauthorized
      end
    rescue => e
      Rails.logger.error "Login error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { message: 'Login failed' }, status: :internal_server_error
    end

    def show
      current_user = nil

      # First check session
      if session["warden.user..key"].is_a?(Hash) && session["warden.user..key"]["id"]
        current_user = User.find_by(id: session["warden.user..key"]["id"])
        if current_user
          # Check if session is expired
          if session_expired?
            reset_session
            warden.logout
            current_user = nil
          end
        end
      end

      # Then check remember token
      if !current_user && cookies.signed[:remember_user_token].present?
        token = cookies.signed[:remember_user_token]
        debugger

        # Check if token is valid
        if token.is_a?(Array) && token.size == 3

          # Check if token is expired
          if token[2].is_a?(String)
            expiration_time = Time.at(token[2].to_f)

            if expiration_time < Time.current
              # Clear expired token and warden user
              cookies.delete(:remember_user_token, {
                domain: Rails.application.credentials.dig(:domain, Rails.env.to_sym, :url) || :all,
                path: '/',
                secure: Rails.env.production?,
                same_site: :lax
              })
              warden.logout
              return render json: { error: 'Session expired' }, status: :unauthorized
            end
          end

          # If token is valid, try to find user
          if token[0].is_a?(Array) && token[0][0].is_a?(Integer)
            user_id = token[0][0]
            current_user = User.find_by(id: user_id)
            if current_user
              sign_in(current_user)
              warden.set_user(current_user)
            end
          end
        end
      end

      # Finally check warden
      if !current_user
        current_user = warden.user
        if current_user
          if session_expired?
            warden.logout
            current_user = nil
          end
        end
      end

      if current_user
        render json: { user: current_user.as_json(only: [:id, :email]) }, status: :ok
      else
        render json: { error: 'Not authenticated' }, status: :unauthorized
      end
    rescue StandardError => e
      Rails.logger.error "Current user check error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { message: 'Authentication check failed' }, status: :internal_server_error
    end

    def destroy
      if current_user
        if current_user.respond_to?(:forget_me!)
          current_user.forget_me!
        end
        # Clear the remember token cookie with the same options used when setting it
        cookies.delete(:remember_user_token, {
          domain: Rails.application.credentials.dig(:domain, Rails.env.to_sym, :url) || :all,
          path: '/',
          secure: Rails.env.production?,
          same_site: :lax
        })
        sign_out(:user)
        reset_session
        render json: { message: 'Logged out successfully' }, status: :ok
      else
        render json: { message: 'No user to log out' }, status: :ok
      end
    end

    def user_info
      if current_user
        render json: {
          user: current_user.as_json(only: [:id, :email])
        }, status: :ok
      else
        render json: { error: 'Not authenticated' }, status: :unauthorized
      end
    end

    private

    def sign_in_params
      if params[:user]
        params.require(:user).permit(:email, :password).tap do |user_params|
          user_params[:email] = user_params[:email]&.strip
        end
      elsif params[:session] && params[:session][:user]
        params[:session].require(:user).permit(:email, :password).tap do |user_params|
          user_params[:email] = user_params[:email]&.strip
        end
      else
        # Return nil instead of rendering to avoid double render
        nil
      end
    rescue ActionController::ParameterMissing => e
      # Return nil instead of rendering to avoid double render
      nil
    end

    def warden
      request.env['warden']
    end

    def session_expired?
      # Check if session is older than the configured timeout
      if session[:last_activity].present?
        last_activity = Time.at(session[:last_activity].to_i)
        timeout = Devise.timeout_in || 30.minutes
        if last_activity < timeout.ago
          return true
        end
      end
      false
    end
  end
end
