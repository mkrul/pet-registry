class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Add remember token field
  def remember_me!
    self.remember_token = self.class.generate_remember_token
    self.remember_created_at = Time.current
    save(validate: false)
  end

  def forget_me!
    self.remember_token = nil
    self.remember_created_at = nil
    save(validate: false)
  end

  private

  def self.generate_remember_token
    SecureRandom.urlsafe_base64
  end
end
