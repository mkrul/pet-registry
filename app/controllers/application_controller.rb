class ApplicationController < ActionController::Base
  include Devise::Controllers::Helpers
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token, if: :json_request?
  before_action :set_csrf_cookie
  before_action :configure_permitted_parameters, if: :devise_controller?

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  include Pagy::Backend
  include ApplicationHelper

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email])
  end

  private

  def json_request?
    request.format.json?
  end

  def set_csrf_cookie
    if json_request?
      cookies['CSRF-TOKEN'] = {
        value: form_authenticity_token,
        same_site: :strict
      }
    end
  end

  def after_sign_in_path_for(resource)
    Rails.logger.debug "Setting after sign in path for user: #{resource.id}"
    Rails.logger.debug "Current session: #{session.to_h}"
    stored_location_for(resource) || root_path
  end

  def after_sign_out_path_for(resource_or_scope)
    Rails.logger.debug "Setting after sign out path"
    root_path
  end

  def authenticate_user!
    unless user_signed_in?
      Rails.logger.debug "User not authenticated, responding with unauthorized"
      Rails.logger.debug "Current session: #{session.to_h}"
      respond_to do |format|
        format.html { redirect_to new_user_session_path }
        format.json { render json: { error: 'You need to sign in or sign up before continuing.' }, status: :unauthorized }
      end
    end
  end

  def current_user
    @current_user ||= warden.authenticate(scope: :user)
  end

  def user_signed_in?
    !!current_user
  end

  def warden
    request.env['warden']
  end
end
