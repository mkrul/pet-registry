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
    record = to_adapter.get(key[0])
    Rails.logger.debug "Found record: #{record&.id}"
    record if record && record.authenticatable_salt == salt
  end

  def authenticatable_salt
    Rails.logger.debug "Generating authenticatable salt for user: #{id}"
    encrypted_password
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
end
