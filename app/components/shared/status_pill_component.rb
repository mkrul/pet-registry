# frozen_string_literal: true

module Shared
  class StatusPillComponent < ApplicationComponent
    STATUSES = {
      lost: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-300"
      },
      found: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300"
      },
      archived: {
        bg: "bg-gray-100 dark:bg-gray-700",
        text: "text-gray-600 dark:text-gray-300"
      }
    }.freeze

    def initialize(status:)
      @status = status.to_s.downcase.to_sym
    end

    private

    def status_styles
      STATUSES[@status] || STATUSES[:archived]
    end

    def pill_classes
      styles = status_styles
      class_names(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        styles[:bg],
        styles[:text]
      )
    end

    def status_text
      @status.to_s.capitalize
    end
  end
end
