# frozen_string_literal: true

require 'active_interaction'
require 'pagy'

class Reports::Fetch < ActiveInteraction::Base
  string :query, default: nil

  def execute
    if query.present?
      outcome = Reports::Search.run(query: query, page: page, per_page: per_page)
      return errors.merge!(outcome.errors) unless outcome.valid?

      outcome.result
    else
      Report.all
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
