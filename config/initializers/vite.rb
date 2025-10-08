# frozen_string_literal: true

# Vite configuration for development
if Rails.env.development?
  Rails.application.config.after_initialize do
    ViteRuby.configure do |config|
      config.auto_build = true
    end
  end
end
