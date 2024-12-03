# frozen_string_literal: true

require 'active_interaction'
require 'pagy'

class Reports::Fetch < ActiveInteraction::Base
  string :query, default: nil
  string :species, default: nil
  string :color, default: nil
  string :gender, default: nil
  string :sort, default: nil
  integer :page, default: 1
  integer :per_page, default: Report::REPORT_PAGE_LIMIT

  def execute
    if query.present? || species.present? || color.present? || gender.present?
      outcome = Reports::Search.run(
        query: query,
        species: species,
        color: color,
        gender: gender,
        sort: sort,
        page: page,
        per_page: per_page
      )
      return errors.merge!(outcome.errors) unless outcome.valid?

      outcome.result
    else
      Report.order(updated_at: :desc, created_at: :desc)
    end
  end

  private

  def page
    inputs[:page] || 1
  end

  def per_page
    inputs[:per_page] || Report::REPORT_PAGE_LIMIT
  end
end
