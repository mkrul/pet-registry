# frozen_string_literal: true

module Ui
  class PaginationComponent < ApplicationComponent
    def initialize(pagy:)
      @pagy = pagy
    end

    def render?
      @pagy.pages > 1
    end

    private

    def previous_disabled?
      @pagy.page == 1
    end

    def next_disabled?
      @pagy.page == @pagy.pages
    end

    def page_link_classes(active:)
      base = "px-3 py-1 text-sm font-medium rounded-md transition-colors"
      if active
        "#{base} bg-green-600 text-white"
      else
        "#{base} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      end
    end

    def nav_button_classes(disabled:)
      base = "px-3 py-1 text-sm font-medium rounded-md transition-colors"
      if disabled
        "#{base} text-gray-400 dark:text-gray-600 cursor-not-allowed"
      else
        "#{base} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      end
    end
  end
end
