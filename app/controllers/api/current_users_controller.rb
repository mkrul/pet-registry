module Api
  class CurrentUsersController < ApplicationController
    before_action :authenticate_user!, only: :show

    def show
      render json: current_user.as_json(only: [:id, :email])
    end
  end
end