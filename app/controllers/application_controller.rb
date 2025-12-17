class ApplicationController < ActionController::Base
  include Devise::Controllers::Helpers
  include Devise::Controllers::SignInOut
  include Pagy::Backend
  protect_from_forgery with: :null_session

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  include ApplicationHelper

  before_action :set_devise_mapping

  protected

  def after_sign_in_path_for(resource)
    "/dashboard"
  end

  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end

  def after_confirmation_path_for(resource_name, resource)
    new_user_session_path
  end

  private

  def set_devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end
end
