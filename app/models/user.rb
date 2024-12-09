class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  def generate_jwt
    JWT.encode(
      {
        id: id,
        exp: 1.day.from_now.to_i
      },
      Rails.application.credentials.devise_jwt_secret_key!
    )
  end

  def jwt_payload
    super.merge('user_id' => id)
  end
end
