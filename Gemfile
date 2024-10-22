# frozen_string_literal: true

source 'https://rubygems.org'
ruby '3.3.3'
# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem 'rails', '~> 7.2.1'
# use devise for authentication
gem 'devise', '~> 4.9.2'
# The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem 'sprockets-rails', '~> 3.5', '>= 3.5.2'
# Use postgresql as the database for Active Record
gem 'pg', '~> 1.5.8'
# Use the Puma web server [https://github.com/puma/puma]
gem 'puma', '>= 5.0'
# Bundle and transpile JavaScript [https://github.com/rails/jsbundling-rails]
gem 'jsbundling-rails', '~> 1.3', '>= 1.3.1'
# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem 'turbo-rails', '~> 2.0', '>= 2.0.6'
# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem 'stimulus-rails', '~> 1.3', '>= 1.3.4'
# Bundle and process CSS [https://github.com/rails/cssbundling-rails]
gem 'cssbundling-rails', '~> 1.4', '>= 1.4.1'
# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem 'jbuilder', '~> 2.12'
# Use Redis adapter to run Action Cable in production
gem 'redis', '~> 5.3'
# use cloudinary for image upload
gem 'cloudinary', '~> 2.1', '>= 2.1.1'
# use activestorage-cloudinary-service as Cloudinary adapter
gem 'activestorage-cloudinary-service', '~> 0.2.3'
# use searchkick for search
gem 'searchkick', '~> 5.3', '>= 5.3.1'
# use opensearch-ruby for search
gem 'opensearch-ruby', '~> 3.4'
# use active_interaction for service objects
gem 'active_interaction', '~> 5.3'
# use vite_rails for development
gem 'vite_rails', '~> 3.0', '>= 3.0.17'
# use pagy for pagination
gem 'pagy', '~> 9.0', '>= 9.0.7'

# rack-cors is used to enable Cross-Origin Resource Sharing (CORS)
gem 'rack-cors', '~> 2.0', '>= 2.0.2'

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[windows jruby]

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false

gem 'active_model_serializers', '~> 0.10.14'

gem 'image_processing', '~> 1.12'
gem 'mini_magick', '~> 4.11'

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"
group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  # Static analysis for security vulnerabilities [https://brakemanscanner.org/]
  gem 'brakeman', require: false
  gem 'byebug'
  gem 'pry'
  gem 'pry-nav'
  gem 'pry-remote'
  gem 'rspec-rails', '~> 6.1.3'
  gem 'progress_bar'
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem 'web-console'
  # Highlight the fine-grained location where an error occurred [https://github.com/ruby/error_highlight]
  gem 'error_highlight', '>= 0.4.0', platforms: [:ruby]
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem 'capybara'
  gem 'selenium-webdriver'
end
