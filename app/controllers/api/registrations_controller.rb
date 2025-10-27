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

    def update
      user = current_user

      if user.update(update_params)
        render json: {
          message: 'Profile updated successfully.',
          user: UserSerializer.new(user).as_json
        }, status: :ok
      else
        render json: {
          message: "Update failed.",
          errors: user.errors.full_messages
        }, status: :unprocessable_entity
      end
    rescue => e
      render json: { error: 'Update failed' }, status: :internal_server_error
    end

    def change_password
      user = current_user

      if user.valid_password?(password_params[:current_password])
        # Update only the password fields without affecting other attributes
        user.password = password_params[:password]
        user.password_confirmation = password_params[:password_confirmation]

        if user.save
          # Clear the session immediately to prevent additional API calls
          sign_out(:user)
          reset_session

          render json: {
            message: 'Password changed successfully.'
          }, status: :ok
        else
          render json: {
            message: "Password change failed.",
            errors: user.errors.full_messages
          }, status: :unprocessable_entity
        end
      else
        render json: {
          message: "Current password is incorrect.",
          errors: ["Current password is incorrect"]
        }, status: :unprocessable_entity
      end
    rescue => e
      render json: { error: 'Password change failed' }, status: :internal_server_error
    end

    private

    def sign_up_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end

    def update_params
      params.require(:user).permit(:email, :display_name)
    end

    def password_params
      params.require(:user).permit(:current_password, :password, :password_confirmation)
    end

    def warden
      request.env['warden']
    end
  end
end