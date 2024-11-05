# app/interactions/reports/search.rb

# frozen_string_literal: true

require 'active_interaction'

class Reports::Search < ActiveInteraction::Base
  string :query
  integer :page, default: 1
  integer :per_page, default: Report::REPORT_PAGE_LIMIT

  def execute
    Report.search(search_query, **search_options)
  end

  private

  def search_query
    cleaned_query.present? ? cleaned_query : '*'
  end

  def search_options
    options = {
      fields: %w[title description breed_1 breed_2 color_1 color_2 color_3],
      misspellings: { edit_distance: 2 },
      operator: 'or', # Changed from 'and' to 'or'
      where: dynamic_where_clause,
      page: page,
      per_page: per_page,
      order: { _score: :desc, updated_at: :desc, created_at: :desc }
    }

    # When the query is empty, we can disable some search options that rely on the query
    options.delete(:fields) unless cleaned_query.present?

    options
  end

  def dynamic_where_clause
    base_where = { status: 'active' }

    species_filter = extract_species_from_query
    base_where[:species] = species_filter if species_filter

    base_where
  end

  def extract_species_from_query
    lowercased_query = query.downcase
    if lowercased_query.include?('cat')
      'cat'
    elsif lowercased_query.include?('dog')
      'dog'
    else
      nil
    end
  end

  def cleaned_query
    # Remove species keyword from the query
    return query unless species_present?

    cleaned = query.downcase.gsub(/\b(cat|dog)\b/, '').strip
    cleaned.presence # Returns nil if cleaned is empty or whitespace
  end

  def species_present?
    extract_species_from_query.present?
  end
end
