# frozen_string_literal: true

module Api
  class SessionsController < ApplicationController
    def create
      if request.content_type != 'application/json'
        return render json: { error: 'Invalid content type' }, status: :bad_request
      end

      user_params = sign_in_params
      return render json: { error: 'Missing user parameters' }, status: :bad_request unless user_params

      email = user_params[:email]&.downcase
      user = User.where('lower(email) = ?', email).first

      if user&.valid_password?(user_params[:password])
        sign_in(user)
        session[:user_id] = user.id
        set_remember_token(user) if user.respond_to?(:remember_me!)
        render json: success_response(user), status: :ok
      else
        render json: { error: 'Invalid email or password' }, status: :unauthorized
      end
    rescue StandardError => e
      log_error(e)
      render json: { error: 'Login failed' }, status: :internal_server_error
    end

    def show
      current_user = find_current_user
      if current_user
        renew_session
        render json: success_response(current_user), status: :ok
      else
        render json: { error: 'Not authenticated' }, status: :unauthorized
      end
    rescue StandardError => e
      log_error(e)
      render json: { error: 'Authentication check failed' }, status: :internal_server_error
    end

    def destroy
      if current_user
        clear_user_session
        # Ensure session is fully cleared
        request.session_options[:skip] = true
        # Clear CSRF token
        reset_session
        # Return additional headers to help frontend clear state
        response.headers['Clear-Site-Data'] = '"cache", "cookies", "storage", "executionContexts"'
        render json: { message: 'Logged out successfully' }, status: :ok
      else
        render json: { message: 'No user to log out' }, status: :ok
      end
    end

    def user_info
      if current_user
        render json: success_response(current_user), status: :ok
      else
        render json: { error: 'Not authenticated' }, status: :unauthorized
      end
    end

    def poll
      if current_user
        renew_session
        render json: { message: 'Session renewed' }, status: :ok
      else
        render json: { error: 'Not authenticated' }, status: :unauthorized
      end
    end

    private

    def find_current_user
      user = find_user_from_session || find_user_from_remember_token || find_user_from_warden
      user
    end

    def find_user_from_session
      return unless session["warden.user..key"].is_a?(Hash)
      User.find_by(id: session["warden.user..key"]["id"])
    end

    def find_user_from_remember_token
      return unless cookies.signed[:remember_user_token].present?
      token = cookies.signed[:remember_user_token]
      return unless token.is_a?(Array) && token.size == 3 && token[0].is_a?(Array)
      user_id = token[0][0]
      user = User.find_by(id: user_id)
      if user
        sign_in(user)
        warden.set_user(user)
      end
      user
    end

    def find_user_from_warden
      warden.user
    end

    def clear_user_session
      current_user.forget_me! if current_user.respond_to?(:forget_me!)
      cookies.delete(:remember_user_token, cookie_options)
      sign_out(:user)
      reset_session
      warden.logout
      current_user&.update_column(:remember_token, nil) if current_user
    end

    def set_remember_token(user)
      return unless Devise.respond_to?(:remember_for)
      user.remember_me!
      cookies[:remember_user_token] = {
        value: user.class.serialize_into_cookie(user),
        expires: Devise.remember_for.from_now,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax,
        domain: cookie_domain
      }
    end

    def cookie_options
      {
        domain: cookie_domain,
        path: '/',
        secure: Rails.env.production?,
        same_site: :lax
      }
    end

    def cookie_domain
      Rails.application.credentials.dig(:domain, Rails.env.to_sym, :url) || :all
    end

    def success_response(user)
      {
        user: UserSerializer.new(user).as_json,
        message: 'Logged in successfully'
      }
    end

    def log_error(error)
    end

    def sign_in_params
      if params[:user]
        params.require(:user).permit(:email, :password).tap do |user_params|
          user_params[:email] = user_params[:email]&.strip
        end
      elsif params[:session] && params[:session][:user]
        params[:session].require(:user).permit(:email, :password).tap do |user_params|
          user_params[:email] = user_params[:email]&.strip
        end
      end
    rescue ActionController::ParameterMissing
      nil
    end

    def warden
      request.env['warden']
    end

    def renew_session
      session[:last_activity] = Time.current.to_i
      session[:expires_at] = 4.hours.from_now.to_i

      if current_user.respond_to?(:remember_me!) && current_user.remember_token?
        set_remember_token(current_user)
      end
    end
  end
end