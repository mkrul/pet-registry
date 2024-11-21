# app/controllers/api/auth_controller.rb

module Api
  class AuthController < ApplicationController
    skip_before_action :verify_authenticity_token

    def google_oauth2
      token = params[:token]
      user = User.from_omniauth(token)

      if user
        sign_in(user)
        render json: { message: 'Logged in successfully.', user: user.as_json(only: [:id, :email, :name, :image]) }, status: :ok
      else
        render json: { message: 'Authentication failed.' }, status: :unauthorized
      end
    end

    def logout
      sign_out(current_user)
      render json: { message: 'Logged out successfully.' }, status: :ok
    end
  end
end
