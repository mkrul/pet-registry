module Api
  class AuthController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :authenticate_user!, only: [:user_info]
    respond_to :json

    def login
      email = login_params[:email].to_s.strip.downcase
      password = login_params[:password].to_s.strip

      user = User.find_by("LOWER(email) = LOWER(?)", email)

      if user&.valid_password?(password)
        sign_in(user)
        render json: {
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email
          }
        }, status: :ok
      else
        render json: { error: "Invalid email or password" }, status: :unauthorized
      end
    end

    def user_info
      render json: {
        user: {
          id: current_user.id,
          email: current_user.email
        }
      }, status: :ok
    end

    def logout
      if user_signed_in?
        sign_out(current_user)
        render json: { message: "Logged out successfully" }, status: :ok
      else
        render json: { message: "No user to log out" }, status: :ok
      end
    end

    private

    def login_params
      params.require(:user).permit(:email, :password)
    end

    def authenticate_user!
      unless user_signed_in?
        render json: { error: "Not authenticated" }, status: :unauthorized
      end
    end
  end
end