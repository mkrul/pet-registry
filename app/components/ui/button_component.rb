# frozen_string_literal: true

module Ui
  class ButtonComponent < ApplicationComponent
    VARIANTS = {
      primary: "bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white",
      secondary: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200",
      danger: "bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white",
      outline: "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
    }.freeze

    SIZES = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    }.freeze

    def initialize(
      variant: :primary,
      size: :md,
      type: "button",
      disabled: false,
      full_width: false,
      **options
    )
      @variant = variant.to_sym
      @size = size.to_sym
      @type = type
      @disabled = disabled
      @full_width = full_width
      @options = options
    end

    def call
      tag.button(
        content,
        type: @type,
        disabled: @disabled,
        class: button_classes,
        **@options
      )
    end

    private

    def button_classes
      class_names(
        "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800",
        VARIANTS[@variant],
        SIZES[@size],
        @full_width ? "w-full" : nil,
        @disabled ? "cursor-not-allowed opacity-50" : nil
      )
    end
  end
end
