# frozen_string_literal: true

Devise.setup do |config|

  # The secret key used by Devise. Devise uses this key to generate
  # random tokens. Changing this key will render invalid all existing
  # confirmation, reset password and unlock tokens in the database.
  # Devise will use the `secret_key_base` as its `secret_key`
  # by default. You can change it below and use your own secret key.
  # config.secret_key = 'your-secret-key'

  # ==> Controller configuration
  # Configure the parent class to the devise controllers.
  config.parent_controller = 'ActionController::Base'

  # ==> Mailer Configuration
  config.mailer_sender = 'please-change-me-at-config-initializers-devise@example.com'
  config.mailer = 'Devise::Mailer'
  config.parent_mailer = 'ActionMailer::Base'

  # ==> ORM configuration
  require 'devise/orm/active_record'

  # ==> Configuration for :rememberable
  # The time the user will be remembered without asking for credentials again.
  config.remember_for = 2.weeks

  # Invalidates all the remember me tokens when the user signs out.
  config.expire_all_remember_me_on_sign_out = true

  # If true, extends the user's remember period when remembered via cookie.
  config.extend_remember_period = true

  # Options to be passed to the created cookie.
  config.rememberable_options = {
    secure: Rails.env.production?,
    same_site: :lax,
    httponly: true
  }

  # ==> Configuration for :validatable
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/

  # ==> Configuration for :database_authenticatable
  config.strip_whitespace_keys = [:email]
  config.case_insensitive_keys = [:email]
  config.skip_session_storage = [:http_auth]

  # ==> Navigation configuration
  config.sign_out_via = [:delete]

  # ==> Warden configuration
  config.warden do |manager|
    manager.failure_app = Devise::FailureApp
    manager.default_strategies(scope: :user).unshift :rememberable
  end
end
