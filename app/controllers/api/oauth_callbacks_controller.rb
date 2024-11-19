
module Api
  class OauthCallbacksController < Devise::OmniauthCallbacksController
    def google_oauth2
      @user = User.from_omniauth(request.env['omniauth.auth'])

      if @user.persisted?
        sign_in(@user)
        token = current_token
        render json: { message: 'Logged in successfully.', user: @user, token: token }, status: :ok
      else
        render json: { message: 'Authentication failed.' }, status: :unauthorized
      end
    end

    private

    def current_token
      request.env['warden-jwt_auth.token']
    end
  end
end
