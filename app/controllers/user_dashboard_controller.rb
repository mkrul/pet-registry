# frozen_string_literal: true

class UserDashboardController < ApplicationController
  include Pundit::Authorization

  before_action :authenticate_user!
  before_action :authorize_dashboard_access

  def index
    @user = current_user
  end

  private

  def authorize_dashboard_access
    authorize :dashboard, :access?
  end
end
