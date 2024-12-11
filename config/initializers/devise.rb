# frozen_string_literal: true

Devise.setup do |config|

  config.mailer_sender = 'please-change-me-at-config-initializers-devise@example.com'

  require 'devise/orm/active_record'

  config.default_scope = :user
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth]
  config.reconfirmable = true
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours
  config.sign_out_via = :delete
  config.responder.error_status = :unprocessable_entity
  config.responder.redirect_status = :see_other

  # Remember me configuration
  config.remember_for = 2.weeks
  config.extend_remember_period = true
  config.rememberable_options = { secure: Rails.env.production? }

  # Cookie configuration
  config.navigational_formats = ['*/*', :html, :json]
  config.http_authenticatable_on_xhr = true
  config.http_authenticatable = true

end
