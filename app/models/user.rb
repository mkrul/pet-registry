# app/models/user.rb

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, :omniauthable,
         jwt_revocation_strategy: JwtDenylist,
         omniauth_providers: [:google_oauth2]

  def self.from_omniauth(token)
    client = Google::Auth::IDTokens.verify_oidc(token, aud: Rails.application.credentials.dig(:google_oauth, :client_id))

    where(email: client['email']).first_or_create do |user|
      user.email = client['email']
      user.name = client['name'] || client['email']
      user.password = Devise.friendly_token[0, 20]
      user.image = client['picture']
    end
  rescue Google::Auth::IDTokens::VerificationError => e
    nil
  end
end
