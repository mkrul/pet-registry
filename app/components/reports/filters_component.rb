# frozen_string_literal: true

module Reports
  class FiltersComponent < ViewComponent::Base
    SPECIES_OPTIONS = %w[Dog Cat].freeze
    COLOR_OPTIONS = %w[Black White Gray Yellow Brown Cream Red Orange Tan].freeze
    GENDER_OPTIONS = %w[Male Female].freeze
    SORT_OPTIONS = ["Newest", "Oldest", "Recently Updated"].freeze

    attr_reader :filters, :remember_filters

    def initialize(filters: {}, remember_filters: true)
      @filters = filters.with_indifferent_access
      @remember_filters = remember_filters
    end

    def species_options
      SPECIES_OPTIONS
    end

    def color_options
      COLOR_OPTIONS
    end

    def gender_options
      GENDER_OPTIONS
    end

    def sort_options
      SORT_OPTIONS
    end

    def state_options
      @state_options ||= load_states
    end

    def current_species
      filters[:species]
    end

    def current_color
      filters[:color]
    end

    def current_gender
      filters[:gender]
    end

    def current_state
      filters[:state]
    end

    def current_sort
      filters[:sort].presence || "Newest"
    end

    def current_query
      filters[:query].to_s
    end

    private

    def load_states
      file_path = Rails.root.join("config", "states.json")
      return [] unless File.exist?(file_path)

      data = JSON.parse(File.read(file_path))
      data["options"] || []
    rescue JSON::ParserError
      []
    end
  end
end
