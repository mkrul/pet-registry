# Enable colorized output
Pry.config.color = true

# Display a prompt that shows the current Rails environment
Pry.config.prompt = Pry::Prompt.new(
  "rails_prompt",
  "Custom prompt with environment and object context",
  [
    proc { |target_self, nest_level, pry|
      "#{Rails.env}[#{Pry.view_clip(target_self)}](#{nest_level}): #{pry.input_array.size} > "
    },
    proc { |target_self, nest_level, pry|
      "#{Rails.env}[#{Pry.view_clip(target_self)}](#{nest_level}): #{pry.input_array.size} * "
    }
  ]
)

# Enable paging for large outputs
Pry.config.pager = true

# Ensure Rails is defined before adding Rails-specific commands
Pry.commands.alias_command 'e', 'exit'
Pry.commands.alias_command 'q', 'exit-program'
Pry.commands.alias_command 'w', 'whereami'

if defined?(PryDebugger)
  Pry.commands.alias_command 'c', 'continue'
  Pry.commands.alias_command 's', 'step'
  Pry.commands.alias_command 'n', 'next'
  Pry.commands.alias_command 'f', 'finish'
end

# Load ActiveRecord methods for easy debugging of queries
if defined?(ActiveRecord::Base)
  Pry.config.extra_sticky_locals[:active_record] = ActiveRecord::Base
end

# Automatically load the 'awesome_print' gem (for nicely formatted output) if it's installed
begin
  require 'awesome_print'
  AwesomePrint.pry!
rescue LoadError
  # awesome_print not installed
end

# Add additional Rails-related helper commands
if defined?(Rails)
  Pry.config.commands.block_command 'reload_routes', 'Reloads the Rails routes' do
    Rails.application.reload_routes!
    puts "Routes reloaded!"
  end
end

# Custom commands for common tasks (optional)
Pry.commands.block_command 'log', 'Toggle Rails logging on/off' do
  if defined?(Rails) && Rails.logger.level == 0
    Rails.logger.level = 1
    puts "Rails logging is OFF"
  else
    Rails.logger.level = 0
    puts "Rails logging is ON"
  end
end
