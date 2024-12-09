class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  # Validations
  validates :email, presence: true, uniqueness: true

  before_create :initialize_jti

  private

  def initialize_jti
    self.jti ||= SecureRandom.uuid
  end
end
