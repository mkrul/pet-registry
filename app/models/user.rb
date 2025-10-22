class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :authentication_keys => [:email]

  has_many :reports, dependent: :destroy
  has_many :pets, dependent: :destroy
  has_many :events, dependent: :destroy

  # Add case-insensitive email validation
  before_validation :downcase_email
  before_validation :normalize_phone_number
  before_save :normalize_blank_fields
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: false
  validates :phone_number, format: { with: /\A\d{10}\z/, message: "must be 10 digits" }, allow_blank: true
  validates :display_name, length: { maximum: 50 }, allow_blank: true
  validates :password, length: { in: 8..20, message: "must be between 8 and 20 characters" }, allow_blank: true

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

  def normalize_phone_number
    return if phone_number.blank?

    # Remove all non-digit characters
    digits_only = phone_number.gsub(/\D/, '')

    # If it starts with 1, remove it (US country code)
    if digits_only.length == 11 && digits_only.start_with?('1')
      digits_only = digits_only[1..-1]
    end

    # Only set if we have exactly 10 digits, otherwise set to nil
    self.phone_number = digits_only.length == 10 ? digits_only : nil
  end

  def normalize_blank_fields
    # Convert blank strings to nil for phone_number and display_name
    self.phone_number = nil if phone_number.blank?
    self.display_name = nil if display_name.blank?
  end
end
