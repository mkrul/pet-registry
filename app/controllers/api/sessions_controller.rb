module Api
  class SessionsController < Devise::SessionsController
    respond_to :json
    skip_before_action :verify_authenticity_token
    skip_before_action :require_no_authentication

    def create
      user = User.find_for_database_authentication(email: sign_in_params[:email])
      if user&.valid_password?(sign_in_params[:password])
        sign_in(user)
        render json: {
          message: 'Logged in successfully.',
          user: user.as_json(only: [:id, :email])
        }, status: :ok
      else
        render json: { message: 'Invalid email or password.' }, status: :unauthorized
      end
    end

    private

    def sign_in_params
      params.require(:user).permit(:email, :password)
    end

    def respond_to_on_destroy
      render json: { message: 'Logged out successfully.' }, status: :ok
    end
  end
end
