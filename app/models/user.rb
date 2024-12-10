class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  Rails.logger.debug "User model loaded with Devise session authentication"
end
