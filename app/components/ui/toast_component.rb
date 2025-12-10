# frozen_string_literal: true

module Ui
  class ToastComponent < ApplicationComponent
    TYPES = {
      success: {
        bg: "bg-green-50 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300",
        border: "border-green-200 dark:border-green-800",
        icon_color: "text-green-400 dark:text-green-500"
      },
      error: {
        bg: "bg-red-50 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-300",
        border: "border-red-200 dark:border-red-800",
        icon_color: "text-red-400 dark:text-red-500"
      },
      warning: {
        bg: "bg-yellow-50 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-300",
        border: "border-yellow-200 dark:border-yellow-800",
        icon_color: "text-yellow-400 dark:text-yellow-500"
      },
      info: {
        bg: "bg-blue-50 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-800",
        icon_color: "text-blue-400 dark:text-blue-500"
      }
    }.freeze

    def initialize(type:, message:, auto_dismiss: true, dismiss_after: 5000)
      @type = type.to_sym
      @message = message
      @auto_dismiss = auto_dismiss
      @dismiss_after = dismiss_after
    end

    private

    def type_styles
      TYPES[@type] || TYPES[:info]
    end

    def container_classes
      styles = type_styles
      class_names(
        "p-4 rounded-md flex items-center justify-between border",
        styles[:bg],
        styles[:text],
        styles[:border]
      )
    end

    def icon_classes
      class_names("h-5 w-5", type_styles[:icon_color])
    end
  end
end
