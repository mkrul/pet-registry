# frozen_string_literal: true

# Vite configuration for development
if Rails.env.development?
  Rails.application.config.after_initialize do
    # Use auto-build mode for better Docker compatibility
    ViteRuby.configure do |config|
      config.auto_build = true  # Use static builds instead of dev server
    end
  end
end
