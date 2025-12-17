# frozen_string_literal: true

module Reports
  class SearchPanelComponent < ViewComponent::Base
    attr_reader :filters, :remember_filters

    def initialize(filters: {}, remember_filters: true)
      @filters = filters
      @remember_filters = remember_filters
    end

    def current_query
      filters[:query].to_s
    end
  end
end
