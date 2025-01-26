# Be sure to restart your server when you modify this file.

Rails.application.config.session_store :cookie_store,
  key: '_pet_registry_session',
  expire_after: 1.day,
  domain: Rails.env.production? ?
    Rails.application.credentials.dig(:domain, Rails.env.to_sym, :url) : :all,
  same_site: :lax,
  secure: Rails.env.production?,
  httponly: true