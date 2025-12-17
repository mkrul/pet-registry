# frozen_string_literal: true

module Ui
  class SelectComponent < ViewComponent::Base
    attr_reader :name, :options, :selected, :placeholder, :clearable, :label

    def initialize(name:, options:, selected: nil, placeholder: nil, clearable: true, label: nil, **html_options)
      @name = name
      @options = options
      @selected = selected
      @placeholder = placeholder || "Select..."
      @clearable = clearable
      @label = label
      @html_options = html_options
    end

    def selected_label
      return nil if selected.blank?

      option = options.find { |opt| option_value(opt) == selected }
      option ? option_label(option) : selected
    end

    def option_value(option)
      option.is_a?(Array) ? option.last : option
    end

    def option_label(option)
      option.is_a?(Array) ? option.first : option
    end

    def input_id
      @html_options[:id] || "select_#{name}"
    end

    def wrapper_classes
      "relative"
    end

    def button_classes
      [
        "w-full px-3 py-2 text-left text-sm",
        "bg-white dark:bg-gray-700",
        "border border-gray-300 dark:border-gray-600 rounded-md",
        "text-gray-900 dark:text-gray-100",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
        "cursor-pointer",
        "flex items-center justify-between"
      ].join(" ")
    end

    def dropdown_classes
      [
        "absolute z-50 w-full mt-1",
        "bg-white dark:bg-gray-700",
        "border border-gray-300 dark:border-gray-600 rounded-md",
        "shadow-lg",
        "max-h-60 overflow-auto",
        "hidden"
      ].join(" ")
    end

    def option_classes
      [
        "px-3 py-2 text-sm cursor-pointer",
        "text-gray-900 dark:text-gray-100",
        "hover:bg-gray-100 dark:hover:bg-gray-600",
        "focus:bg-gray-100 dark:focus:bg-gray-600 focus:outline-none"
      ].join(" ")
    end

    def selected_option_classes
      "bg-blue-50 dark:bg-blue-900/30"
    end

    def placeholder_classes
      "text-gray-500 dark:text-gray-400"
    end
  end
end
