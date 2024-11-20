
module Api
  class OauthCallbacksController < Devise::OmniauthCallbacksController
    skip_before_action :verify_authenticity_token, only: :google_oauth2

    def google_oauth2
      @user = User.from_omniauth(request.env['omniauth.auth'])

      if @user.persisted?
        sign_in @user
        token = request.env['warden-jwt_auth.token']
        render json: { message: 'Logged in successfully.', user: @user, token: token }, status: :ok
      else
        render json: { message: 'Authentication failed.' }, status: :unauthorized
      end
    end

    def failure
      render json: { message: 'Authentication failed.' }, status: :unauthorized
    end
  end
end
