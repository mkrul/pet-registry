class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
  respond_to :json

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  include Pagy::Backend
  include ApplicationHelper

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user!, unless: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password, :remember_me])
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 200, message: 'Success' },
        data: UserSerializer.new(resource).as_json
      }
    else
      render json: {
        status: { message: "Error", errors: resource.errors.full_messages },
      }, status: :unprocessable_entity
    end
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: { code: 200, message: 'Logged out successfully.' }
      }
    else
      render json: {
        status: { code: 401, message: 'Couldn\'t find an active session.' }
      }, status: :unauthorized
    end
  end
end
