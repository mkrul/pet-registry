require 'googleauth/id_tokens'

class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, :omniauthable,
         jwt_revocation_strategy: JwtDenylist,
         omniauth_providers: [:google_oauth2]

  def self.from_google_token(token)
    payload = Google::Auth::IDTokens.verify_oidc(
      token,
      aud: Rails.application.credentials.dig(:google_oauth, :client_id)
    )

    email = payload['email']
    name = payload['name']
    picture = payload['picture']

    user = User.find_by(email: email)

    unless user
      user = User.new(
        email: email,
        name: name,
        password: Devise.friendly_token[0, 20],
        image: picture
      )
      user.save!
    end

    user
  rescue Google::Auth::IDTokens::VerificationError => e
    Rails.logger.error "Google ID token verification failed: #{e.message}"
    nil
  rescue StandardError => e
    Rails.logger.error "Error creating user from Google token: #{e.message}"
    nil
  end

end
