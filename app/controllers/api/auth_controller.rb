module Api
  class AuthController < ApplicationController
    respond_to :json
    skip_before_action :verify_authenticity_token

    def authenticated_user
      if user_signed_in?
        render json: {
          user: current_user.as_json(only: [:id, :email])
        }, status: :ok
      else
        render json: { user: nil }, status: :ok
      end
    end

    def logout
      sign_out(current_user)
      render json: { message: 'Logged out successfully.' }, status: :ok
    end
  end
end