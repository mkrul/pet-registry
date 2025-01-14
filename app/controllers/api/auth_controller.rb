module Api
  class AuthController < ApplicationController
    include Devise::Controllers::Helpers

    before_action :authenticate_user!, only: [:current_user]

    def login
      user = User.find_by(email: login_params[:email])

      if user&.valid_password?(login_params[:password])
        user.remember_me!
        sign_in(:user, user)
        render json: {
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email
          }
        }
      else
        render json: { error: "Invalid email or password" }, status: :unauthorized
      end
    end

    def current_user
      if user_signed_in?
        render json: {
          user: {
            id: current_user.id,
            email: current_user.email
          }
        }
      else
        render json: { error: "Not authenticated" }, status: :unauthorized
      end
    end

    def logout
      if current_user
        current_user.forget_me!
        sign_out(current_user)
        reset_session
      end

      render json: { message: "Logged out successfully" }
    end

    private

    def login_params
      params.require(:user).permit(:email, :password)
    end
  end
end