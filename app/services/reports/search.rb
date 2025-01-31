require 'active_interaction'

class Reports::Search < ActiveInteraction::Base
  string :query, default: nil
  string :species, default: nil
  string :color, default: nil
  string :gender, default: nil
  string :state, default: nil
  string :area, default: nil
  string :country, default: nil
  string :sort, default: nil
  integer :page, default: 1
  integer :per_page, default: Report::REPORT_PAGE_LIMIT
  string :breed, default: nil

  def execute
    search_options = {
      where: where_conditions,
      page: page,
      per_page: per_page,
      order: sort_order
    }

    if query.present? && !breed.present?
      search_options[:fields] = ["breed_1^10", "breed_2^10", "description^5", "title^2", "color_1^2", "color_2^2", "color_3^2", "species^10"]
      search_options[:match] = :word_middle
      search_options[:misspellings] = { below: 2 }
      search_options[:operator] = "or"
      Report.search(query.downcase, **search_options)
    else
      Report.search("*", **search_options)
    end
  end

  private

  def where_conditions
    conditions = { status: 'active' }
    # Set species condition, prioritizing explicit filter over query content
    if species.present?
      conditions[:species] = species.downcase
    elsif query.present? && !species.present?  # Only check query if no species filter
      query_words = query.downcase.split
      if query_words.include?('dog')
        conditions[:species] = 'dog'
      elsif query_words.include?('cat')
        conditions[:species] = 'cat'
      end
    end

    # Add location conditions
    if country.present?
      conditions[:country] = country
    end

    if state.present?
      conditions[:state] = state
    end

    if area.present?
      conditions[:area] = area
    end

    # Add other filters
    filters = []

    if gender.present?
      gender_value = gender.downcase
      filters << {
        _or: [
          { gender: gender_value },
          { gender: "#{gender_value} (intact)" },
          { gender: "#{gender_value} (neutered)" },
          { gender: "#{gender_value} (spayed)" }
        ]
      }
    end

    if color.present?
      color_value = color.downcase
      filters << {
        _or: [
          { color_1: color_value },
          { color_2: color_value },
          { color_3: color_value }
        ]
      }
    end

    # Add other filters to conditions
    if filters.any?
      conditions[:_and] ||= []
      conditions[:_and].concat(filters)
    end

    conditions
  end

  def sort_order
    case sort&.downcase
    when 'oldest'
      { created_at: :asc }
    when 'recently updated'
      { updated_at: :desc }
    else # 'newest' or default
      { created_at: :desc }
    end
  end
end
