Pry.config.color = true

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

Pry.config.pager = true

Pry.commands.alias_command 'e', 'exit'
Pry.commands.alias_command 'q', 'exit-program'
Pry.commands.alias_command 'w', 'whereami'

if defined?(PryDebugger)
  Pry.commands.alias_command 'c', 'continue'
  Pry.commands.alias_command 's', 'step'
  Pry.commands.alias_command 'n', 'next'
  Pry.commands.alias_command 'f', 'finish'
end

if defined?(ActiveRecord::Base)
  Pry.config.extra_sticky_locals[:active_record] = ActiveRecord::Base
end

begin
  require 'awesome_print'
  AwesomePrint.pry!
rescue LoadError
  # awesome_print not installed
end

if defined?(Rails)
  Pry.config.commands.block_command 'reload_routes', 'Reloads the Rails routes' do
    Rails.application.reload_routes!
    puts "Routes reloaded!"
  end
end

Pry.commands.block_command 'log', 'Toggle Rails logging on/off' do
  if defined?(Rails) && Rails.logger.level == 0
    Rails.logger.level = 1
    puts "Rails logging is OFF"
  else
    Rails.logger.level = 0
    puts "Rails logging is ON"
  end
end
