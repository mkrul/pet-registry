# frozen_string_literal: true

if Rails.env.development?
  require 'byebug/core'
  begin
    if Rails.env.development?
      Byebug.start_server 'localhost', ENV.fetch('BYEBUG_SERVER_PORT', 8989).to_i
    else
      url = Rails.application.credentials.dig(:domain, Rails.env.to_sym, :url)

      Byebug.start_server url, ENV.fetch('BYEBUG_SERVER_PORT', 8989).to_i
    end
  rescue Errno::EADDRINUSE
    Rails.logger.debug 'Byebug server already running'
  end
end
