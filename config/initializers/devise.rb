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

  config.omniauth :google_oauth2,
                  Rails.application.credentials.dig(:google_oauth, :client_id),
                  Rails.application.credentials.dig(:google_oauth, :client_secret),
                  {
                    scope: 'email,profile',
                    prompt: 'select_account',
                    image_aspect_ratio: 'square',
                    image_size: 50
                  }

  # ==> Configuration for :jwt_authenticatable
  config.jwt do |jwt|
    jwt.secret = Rails.application.credentials.dig(:devise_jwt_secret_key)
    jwt.dispatch_requests = [
      ['POST', %r{^/api/auth/google_oauth2$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/api/auth/logout$}]
    ]
    jwt.expiration_time = 1.day.to_i
  end
end
