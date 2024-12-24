# frozen_string_literal: true

require 'active_interaction'

class Reports::Fetch < ActiveInteraction::Base
  string :query, default: nil
  string :species, default: nil
  string :color, default: nil
  string :gender, default: nil
  string :sort, default: nil
  integer :page, default: 1
  integer :per_page, default: Report::REPORT_PAGE_LIMIT

  def execute
    outcome = Reports::Search.run(
      query: query,
      species: species,
      color: color,
      gender: gender,
      sort: sort,
      page: page,
      per_page: per_page
    )

    if outcome.valid?
      outcome.result
    else
      errors.merge!(outcome.errors)
      nil
    end
  end
end
