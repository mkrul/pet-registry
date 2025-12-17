# frozen_string_literal: true

module Ui
  class ConfirmModalComponent < ViewComponent::Base
    attr_reader :title, :message, :confirm_text, :cancel_text, :confirm_button_color

    def initialize(
      title: "Confirm",
      message: "Are you sure?",
      confirm_text: "Confirm",
      cancel_text: "Cancel",
      confirm_button_color: "blue"
    )
      @title = title
      @message = message
      @confirm_text = confirm_text
      @cancel_text = cancel_text
      @confirm_button_color = confirm_button_color
    end

    def confirm_button_classes
      base = "px-4 py-2 rounded-md text-sm font-medium transition-colors"

      case confirm_button_color
      when "red"
        "#{base} bg-red-600 hover:bg-red-700 text-white"
      when "green"
        "#{base} bg-green-600 hover:bg-green-700 text-white"
      else
        "#{base} bg-blue-600 hover:bg-blue-700 text-white"
      end
    end

    def cancel_button_classes
      "px-4 py-2 rounded-md text-sm font-medium transition-colors bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200"
    end
  end
end
