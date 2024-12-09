module Api
  class SessionsController < Devise::SessionsController
    respond_to :json
    skip_before_action :verify_authenticity_token
    skip_before_action :require_no_authentication

    def create
      user = User.find_for_database_authentication(email: sign_in_params[:email])
      if user&.valid_password?(sign_in_params[:password])
        sign_in(user)
        token = user.generate_jwt
        response.headers['Authorization'] = "Bearer #{token}"
        render json: {
          message: 'Logged in successfully.',
          user: UserSerializer.new(user).as_json,
          token: token
        }, status: :ok
      else
        render json: { message: 'Invalid email or password.' }, status: :unauthorized
      end
    end

    def destroy
      signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
      render json: {
        message: 'Logged out successfully.'
      }, status: :ok
    end

    private

    def sign_in_params
      params.require(:user).permit(:email, :password)
    end

    def respond_to_on_destroy
      head :no_content
    end
  end
end
