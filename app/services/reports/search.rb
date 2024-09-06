# frozen_string_literal: true

require 'active_interaction'

class Reports::Search < ActiveInteraction::Base
  string :query

  def execute
    Report.search(query, **search_options)
  end

  private

  def search_options
    {
      fields: %w[title description species breed_1 breed_2 color_1 color_2 color_3],
      misspellings: { edit_distance: 2 },
      operator: 'or'
    }
  end
end
