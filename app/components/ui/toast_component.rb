# frozen_string_literal: true

module Ui
  class ToastComponent < ViewComponent::Base
    TYPE_STYLES = {
      success: "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300",
      error: "bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300",
      warning: "bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300",
      info: "bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300",
      notice: "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300",
      alert: "bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300"
    }.freeze

    def initialize(type:, message:, auto_dismiss: true)
      @type = type.to_s.downcase.to_sym
      @message = message
      @auto_dismiss = auto_dismiss
    end

    def type_classes
      TYPE_STYLES[@type] || TYPE_STYLES[:info]
    end

    def dismiss_delay
      base_time = 3000
      char_time = 50
      [base_time + (@message.to_s.length * char_time), 10000].min
    end

    def screen_reader_prefix
      case @type
      when :success, :notice then "Success: "
      when :error, :alert then "Error: "
      when :warning then "Warning: "
      else "Info: "
      end
    end
  end
end
