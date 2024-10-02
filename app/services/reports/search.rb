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
      fields: %w[title description name gender species breed_1 breed_2 color_1 color_2 color_3],
      misspellings: { edit_distance: 2 },
      operator: 'or',
      where: { status: 'active' },
      page: page,
      per_page: per_page
    }
  end
end
