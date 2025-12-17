# frozen_string_literal: true

module Ui
  class PaginationComponent < ViewComponent::Base
    include Pagy::Frontend

    attr_reader :pagy, :turbo_frame

    def initialize(pagy:, turbo_frame: nil)
      @pagy = pagy
      @turbo_frame = turbo_frame
    end

    def render?
      pagy.pages > 1
    end

    def current_page
      pagy.page
    end

    def total_pages
      pagy.pages
    end

    def total_count
      pagy.count
    end

    def prev_page
      pagy.prev
    end

    def next_page
      pagy.next
    end

    def page_range
      start_page = [current_page - 2, 1].max
      end_page = [current_page + 2, total_pages].min

      if end_page - start_page < 4
        if start_page == 1
          end_page = [start_page + 4, total_pages].min
        elsif end_page == total_pages
          start_page = [end_page - 4, 1].max
        end
      end

      (start_page..end_page).to_a
    end

    def show_first_ellipsis?
      page_range.first > 2
    end

    def show_last_ellipsis?
      page_range.last < total_pages - 1
    end

    def show_first_page?
      page_range.first > 1
    end

    def show_last_page?
      page_range.last < total_pages
    end

    def page_url(page)
      params = request.query_parameters.merge(page: page)
      "?#{params.to_query}"
    end

    def link_classes(active: false, disabled: false)
      base = "px-3 py-2 text-sm font-medium rounded-md transition-colors"

      if disabled
        "#{base} text-gray-400 dark:text-gray-500 cursor-not-allowed"
      elsif active
        "#{base} bg-blue-600 text-white"
      else
        "#{base} text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
      end
    end

    def turbo_data
      turbo_frame.present? ? { turbo_frame: turbo_frame } : {}
    end
  end
end
