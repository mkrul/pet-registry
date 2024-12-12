class ApplicationController < ActionController::Base
  include Devise::Controllers::Helpers
  include Devise::Controllers::SignInOut
  protect_from_forgery with: :null_session

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  include Pagy::Backend
  include ApplicationHelper

  before_action :set_devise_mapping
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def set_devise_mapping
    if request.path.start_with?('/api/auth')
      @devise_mapping = Devise.mappings[:user]
      Rails.logger.debug "Setting Devise mapping for API auth: #{@devise_mapping.inspect}"
    end
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
  end
end
