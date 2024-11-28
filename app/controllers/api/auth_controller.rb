# app/controllers/api/auth_controller.rb

module Api
  class AuthController < ApplicationController
    skip_before_action :verify_authenticity_token

    def google_oauth2
      token = params[:token]
      user = User.from_google_token(token)

      if user
        sign_in(user)
        jwt_token = current_token

        cookies.signed[:jwt] = {
          value: jwt_token,
          httponly: true,
          secure: Rails.env.production?,
          same_site: :lax
        }

        render json: { message: 'Logged in successfully.', user: user.as_json(only: [:id, :email, :name, :image]) }, status: :ok
      else
        render json: { message: 'Authentication failed.' }, status: :unauthorized
      end
    end

    def logout
      sign_out(current_user)

      jwt_token = current_token

      if jwt_token
        decoded_token = JWT.decode(
          jwt_token,
          Rails.application.credentials.dig(:devise_jwt_secret_key),
          true,
          { algorithm: 'HS256' }
        )
        jti = decoded_token.first['jti']
        exp = Time.at(decoded_token.first['exp'])
        JwtDenylist.create(jti: jti, exp: exp)
      end

      cookies.delete(:jwt)

      render json: { message: 'Logged out successfully.' }, status: :ok
    end

    def authenticated_user
      if user_signed_in?
        render json: { user: current_user.as_json(only: [:id, :email, :name, :image]) }, status: :ok
      else
        render json: { user: nil }, status: :ok
      end
    end

    def current_token
      request.env['warden-jwt_auth.token']
    end

  end
end
