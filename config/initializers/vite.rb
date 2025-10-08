# frozen_string_literal: true

# Vite configuration for development
if Rails.env.development?
  Rails.application.config.after_initialize do
    # Use Vite dev server for hot reload and faster development
    ViteRuby.configure do |config|
      config.auto_build = true  # Use auto-build to generate manifest
    end
  end
end
