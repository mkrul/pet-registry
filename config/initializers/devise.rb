# frozen_string_literal: true

Devise.setup do |config|
  config.mailer_sender = 'please-change-me-at-config-initializers-devise@example.com'

  require 'devise/orm/active_record'

  config.navigational_formats = [:json]
  config.parent_controller = 'ActionController::Base'

  # Authentication
  config.authentication_keys = [:email]
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = []

  # Session
  config.timeout_in = 1.day
  config.remember_for = 1.day
  config.extend_remember_period = true
  config.expire_all_remember_me_on_sign_out = true

  # Password
  config.password_length = 6..128
  config.reset_password_within = 6.hours

  # Email
  config.reconfirmable = true
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/

  # HTTP
  config.sign_out_via = :delete
  config.responder.error_status = :unprocessable_entity
  config.responder.redirect_status = :see_other

  # Warden Configuration
  config.warden do |manager|
    manager.default_strategies(scope: :user).unshift :database_authenticatable
    manager.failure_app = Devise::FailureApp.new
  end
end
