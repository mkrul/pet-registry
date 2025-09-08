# This file is used by Rack-based servers to start the application.

require_relative "config/environment"

map "/up" do
  run ->(env) { [200, {"Content-Type" => "text/plain"}, ["OK"]] }
end

run Rails.application
Rails.application.load_server