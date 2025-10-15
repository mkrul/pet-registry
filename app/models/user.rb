class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :authentication_keys => [:email]

  has_many :reports, dependent: :destroy
  has_many :pets, dependent: :destroy

  # Add case-insensitive email validation
  before_validation :downcase_email, :normalize_phone_number
  validates :phone_number, format: { with: /\A\d{10}\z/, message: "must be 10 digits" }, allow_blank: true

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

  def formatted_phone_number
    return nil if phone_number.blank?
    "(#{phone_number[0..2]}) #{phone_number[3..5]}-#{phone_number[6..9]}"
  end

  private

  def downcase_email
    self.email = email.downcase if email.present?
  end

  def normalize_phone_number
    return if phone_number.blank?

    # Remove all non-digit characters
    digits_only = phone_number.gsub(/\D/, '')

    # If it starts with 1, remove it (US country code)
    if digits_only.length == 11 && digits_only.start_with?('1')
      digits_only = digits_only[1..-1]
    end

    self.phone_number = digits_only
  end
end
