# frozen_string_literal: true

class DashboardController < ApplicationController
  include Pundit::Authorization

  before_action :authenticate_user!
  before_action :authorize_dashboard_access
  layout 'dashboard'

  def index
    @user = current_user
    @active_section = params[:section] || 'overview'
  end

  def reports
    @user = current_user
    @active_section = 'reports'
    render :index
  end

  def pets
    @user = current_user
    @active_section = 'pets'
    render :index
  end

  def profile
    @user = current_user
    @active_section = 'profile'
    render :index
  end

  def settings
    @user = current_user
    @active_section = 'settings'
    render :index
  end

  private

  def authorize_dashboard_access
    authorize :dashboard, :access?
  end
end
