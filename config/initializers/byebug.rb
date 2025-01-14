# frozen_string_literal: true

if Rails.env.development?
  require 'byebug/core'
  begin
    if Rails.env.development?
      Byebug.start_server 'localhost', ENV.fetch('BYEBUG_SERVER_PORT', 8989).to_i
    else
      protocol = Rails.application.credentials.dig(:domain, Rails.env.to_sym, :protocol)
      top_level = Rails.application.credentials.dig(:domain, Rails.env.to_sym, :top_level)
      second_level = Rails.application.credentials.dig(:domain, Rails.env.to_sym, :second_level)
      Byebug.start_server "#{protocol}://#{second_level}.#{top_level}", ENV.fetch('BYEBUG_SERVER_PORT', 8989).to_i
    end
  rescue Errno::EADDRINUSE
    Rails.logger.debug 'Byebug server already running'
  end
end
