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
        # Ensure session is properly maintained
        session[:user_id] = user.id
        session[:last_activity] = Time.current.to_i
        set_remember_token(user) if user.respond_to?(:remember_me!)
        # Set session cookie options
        request.session_options[:renew] = true
        request.session_options[:expire_after] = 1.day
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

    private

    def find_current_user
      Rails.logger.info "Finding current user..."
      user = find_user_from_session || find_user_from_remember_token || find_user_from_warden
      Rails.logger.info "Current user found: #{user&.id}"
      user
    end

    def find_user_from_session
      return unless session["warden.user..key"].is_a?(Hash)
      user = User.find_by(id: session["warden.user..key"]["id"])
      if user && (session_expired? || !user.remember_token?)
        reset_session
        warden.logout
        return nil
      end
      user
    end

    def find_user_from_remember_token
      Rails.logger.info "Checking remember token..."
      return unless cookies.signed[:remember_user_token].present?
      token = cookies.signed[:remember_user_token]
      Rails.logger.info "Remember token present: #{token.inspect}"
      return unless valid_remember_token?(token)
      user_id = token[0][0]
      user = User.find_by(id: user_id)
      Rails.logger.info "User remember token: #{user&.remember_token.inspect}"
      return nil unless user&.remember_token.present?
      if user
        sign_in(user)
        warden.set_user(user)
      end
      user
    end

    def find_user_from_warden
      user = warden.user
      if user && (session_expired? || !user.remember_token?)
        warden.logout
        return nil
      end
      user
    end

    def valid_remember_token?(token)
      return false unless token.is_a?(Array) && token.size == 3 && token[0].is_a?(Array)
      return false unless token[2].is_a?(String)

      expiration_time = Time.at(token[2].to_f)
      return false if expiration_time < Time.current

      true
    end

    def clear_user_session
      Rails.logger.info "Clearing user session..."
      Rails.logger.info "Before clear - Remember token: #{current_user&.remember_token.inspect}"
      current_user.forget_me! if current_user.respond_to?(:forget_me!)
      cookies.delete(:remember_user_token, cookie_options)
      sign_out(:user)
      reset_session
      warden.logout
      current_user&.update_column(:remember_token, nil) if current_user
      Rails.logger.info "After clear - Remember token: #{current_user&.remember_token.inspect}"
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
        user: user.as_json(only: [:id, :email])
      }
    end

    def log_error(error)
      Rails.logger.error "#{controller_name} error: #{error.message}"
      Rails.logger.error error.backtrace.join("\n")
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

    def session_expired?
      return false unless session[:last_activity].present?
      last_activity = Time.at(session[:last_activity].to_i)
      timeout = Devise.timeout_in || 30.minutes
      last_activity < timeout.ago
    end
  end
end