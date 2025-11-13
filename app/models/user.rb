class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :authentication_keys => [:email]

  has_many :reports, dependent: :destroy
  has_many :pets, dependent: :destroy
  has_many :events, dependent: :destroy
  has_many :conversations_as_sender, class_name: 'Conversation', foreign_key: :sender_id, dependent: :destroy
  has_many :conversations_as_recipient, class_name: 'Conversation', foreign_key: :recipient_id, dependent: :destroy
  has_many :messages, dependent: :destroy

  # Add case-insensitive email validation
  before_validation :downcase_email
  before_validation :set_default_settings, on: :create
  before_save :normalize_blank_fields
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: false
  validates :display_name, length: { maximum: 50 }, allow_blank: true
  validates :password, length: { in: 8..20, message: "must be between 8 and 20 characters" }, allow_blank: true

  validates :settings, presence: true
  validate :settings_structure

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


  def normalize_blank_fields
    self.display_name = nil if display_name.blank?
  end

  def set_default_settings
    Rails.logger.debug "set_default_settings called - settings before: #{settings.inspect}"

    # Initialize to empty hash if nil
    self.settings ||= {}

    # Clean up invalid keys from database defaults
    if settings.is_a?(Hash) && settings.present?
      valid_keys = %w[allow_contact dark_mode send_email_for_tip send_email_for_message send_email_for_conversation send_email_for_match]
      invalid_keys = settings.keys.reject { |k| valid_keys.include?(k.to_s) }

      if invalid_keys.any?
        Rails.logger.debug "Removing invalid settings keys: #{invalid_keys.inspect}"
        self.settings = settings.select { |k, _| valid_keys.include?(k.to_s) }
      end
    end

    Rails.logger.debug "set_default_settings completed - settings after: #{settings.inspect}"
  end

  def settings_structure
    Rails.logger.debug "settings_structure validation - settings: #{settings.inspect}"

    return if settings.blank? || settings.empty?

    unless settings.is_a?(Hash)
      Rails.logger.error "settings_structure: settings is not a hash: #{settings.class}"
      errors.add(:settings, "must be a hash")
      return
    end

    valid_keys = %w[allow_contact dark_mode send_email_for_tip send_email_for_message send_email_for_conversation send_email_for_match]
    invalid_keys = []

    settings.each_key do |key|
      unless valid_keys.include?(key.to_s)
        invalid_keys << key
        Rails.logger.error "settings_structure: invalid key found: #{key.inspect}"
      end
    end

    if invalid_keys.any?
      errors.add(:settings, "contains invalid key: #{invalid_keys.first}")
      return
    end

    settings.each do |key, value|
      unless [true, false].include?(value)
        Rails.logger.error "settings_structure: #{key} is not a boolean: #{value.inspect} (#{value.class})"
        errors.add(:settings, "#{key} must be a boolean")
      end
    end

    Rails.logger.debug "settings_structure validation passed"
  end
end
