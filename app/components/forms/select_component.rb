# frozen_string_literal: true

module Forms
  class SelectComponent < ApplicationComponent
    def initialize(
      form:,
      attribute:,
      collection:,
      label: nil,
      hint: nil,
      required: false,
      include_blank: nil,
      prompt: nil,
      **options
    )
      @form = form
      @attribute = attribute
      @collection = collection
      @label = label
      @hint = hint
      @required = required
      @include_blank = include_blank
      @prompt = prompt
      @options = options
    end

    private

    def select_classes
      class_names(
        "w-full rounded-md shadow-sm transition-colors",
        "border border-gray-300 dark:border-gray-600",
        "bg-white dark:bg-gray-700",
        "text-gray-900 dark:text-gray-100",
        "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "dark:focus:ring-blue-400 dark:focus:border-blue-400",
        "disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed",
        @options[:class]
      )
    end

    def label_text
      text = @label || @attribute.to_s.humanize
      text += " *" if @required
      text
    end

    def has_errors?
      @form.object&.errors&.include?(@attribute)
    end

    def error_message
      @form.object&.errors&.full_messages_for(@attribute)&.first
    end
  end
end
