# frozen_string_literal: true

require 'active_interaction'

class Reports::Search < ActiveInteraction::Base
  string :query
  integer :page, default: 1
  integer :per_page, default: Report::REPORT_PAGE_LIMIT

  def execute
    Report.search(query, **search_options)
  end

  private

  def search_options
    {
      fields: [
        { title: 3 },    # Boost matches in title by 3x
        { species: 2 },  # Boost matches in species by 2x
        { description: 1 },
        { name: 1 },
        { gender: 1 },
        { breed_1: 1 },
        { breed_2: 1 },
        { color_1: 1 },
        { color_2: 1 },
        { color_3: 1 }
      ],
      misspellings: { edit_distance: 2 },
      operator: 'or',
      where: { status: 'active' },
      page: page,
      per_page: per_page
    }
  end
end
