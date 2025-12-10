# frozen_string_literal: true

module Ui
  class CardComponent < ApplicationComponent
    def initialize(padding: true, border: true, shadow: true, **options)
      @padding = padding
      @border = border
      @shadow = shadow
      @options = options
    end

    private

    def card_classes
      class_names(
        "bg-white dark:bg-gray-800 rounded-lg",
        @padding ? "p-4 sm:p-6" : nil,
        @border ? "border border-gray-200 dark:border-gray-700" : nil,
        @shadow ? "shadow-sm" : nil,
        @options[:class]
      )
    end
  end
end
