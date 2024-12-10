class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :timeoutable

  after_initialize do
    Rails.logger.debug "User initialized with ID: #{id}"
  end

  def self.serialize_from_session(key, salt)
    Rails.logger.debug "Deserializing user from session with key: #{key}"
    Rails.logger.debug "Salt: #{salt}"
    record = to_adapter.get(key[0][0])
    Rails.logger.debug "Found record: #{record&.id}"
    record if record && record.authenticatable_salt == salt
  end

  def authenticatable_salt
    Rails.logger.debug "Generating authenticatable salt for user: #{id}"
    "#{super}#{remember_token}"
  end

  def remember_me!
    Rails.logger.debug "Remember me called for user: #{id}"
    self.remember_token = generate_remember_token
    self.remember_created_at = Time.current
    save(validate: false)
    Rails.logger.debug "Remember token set: #{remember_token.present?}"
  end

  def forget_me!
    Rails.logger.debug "Forget me called for user: #{id}"
    self.remember_token = nil
    self.remember_created_at = nil
    save(validate: false)
  end

  def remembered?
    Rails.logger.debug "Checking if user #{id} is remembered"
    remember_token.present? && remember_created_at.present? &&
      remember_created_at > 2.weeks.ago
  end

  def timedout?(last_access)
    return false if remember_exists_and_not_expired?
    return false unless last_access
    last_access < Devise.timeout_in.ago.utc
  end

  private

  def remember_exists_and_not_expired?
    return false unless respond_to?(:remember_created_at) && remember_created_at
    remember_created_at.utc > Devise.remember_for.ago.utc
  end

  def generate_remember_token
    loop do
      token = SecureRandom.urlsafe_base64(32)
      Rails.logger.debug "Setting remember token for user: #{id}"
      return token unless User.exists?(remember_token: token)
    end
  end
end
