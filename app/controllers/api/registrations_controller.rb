module Api
  class RegistrationsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def create
      user = User.new(sign_up_params)

      if user.save
        warden.set_user(user)
        sign_in(user)

        if user.respond_to?(:remember_me!) && Devise.respond_to?(:remember_for)
          user.remember_me!
          cookies.signed[:remember_user_token] = {
            value: user.class.serialize_into_cookie(user),
            expires: Devise.remember_for.from_now,
            httponly: true
          }
        end

        render json: {
          message: 'Signed up successfully.',
          user: user.as_json(only: [:id, :email])
        }, status: :ok
      else
        render json: {
          message: "Sign up failed.",
          errors: user.errors.full_messages
        }, status: :unprocessable_entity
      end
    rescue => e
      render json: { error: 'Registration failed' }, status: :internal_server_error
    end

    private

    def sign_up_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end

    def warden
      request.env['warden']
    end
  end
end