class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :authentication_keys => [:email]

  # Add case-insensitive email validation
  before_validation :downcase_email

  # Remove password confirmation requirement if not needed
  # or ensure it's properly handled in the test

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    if email = conditions.delete(:email)
      where(conditions.to_h).where(["lower(email) = :value", { value: email.downcase }]).first
    else
      where(conditions.to_h).first
    end
  end

  private

  def downcase_email
    self.email = email.downcase if email.present?
  end
end
