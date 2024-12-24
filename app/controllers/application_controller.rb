class ApplicationController < ActionController::Base
  include Devise::Controllers::Helpers
  include Devise::Controllers::SignInOut
  protect_from_forgery with: :null_session

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  include ApplicationHelper

  before_action :set_devise_mapping

  private

  def set_devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
    Rails.logger.debug "Devise mapping: #{@devise_mapping.inspect}"
  end
end
