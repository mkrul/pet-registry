require 'active_interaction'

class Reports::Search < ActiveInteraction::Base
  string :query, default: nil
  string :species, default: nil
  string :color, default: nil
  string :gender, default: nil
  string :sort, default: nil
  integer :page, default: 1
  integer :per_page, default: Report::REPORT_PAGE_LIMIT

  def execute
    search_term = query.presence || "*"
    Report.search search_term,
      where: where_conditions,
      fields: search_fields,
      match: :word_start,
      page: page,
      per_page: per_page,
      order: sort_order,
      operator: "or",
      misspellings: { edit_distance: 2 }
  end

  private

  def where_conditions
    conditions = { status: 'active' }

    conditions[:species] = species.downcase if species.present?
    conditions[:gender] = gender.downcase if gender.present?

    if color.present?
      color_value = color.downcase
      conditions[:or] = [
        { color_1: color_value },
        { color_2: color_value },
        { color_3: color_value }
      ]
    end

    conditions
  end

  def search_fields
    if query.present?
      ['title^3', 'description^2', 'breed_1^2', 'breed_2^2', 'color_1', 'color_2', 'color_3', 'gender']
    else
      ['title', 'description', 'breed_1', 'breed_2', 'color_1', 'color_2', 'color_3', 'gender']
    end
  end

  def sort_order
    case sort&.downcase
    when 'newest'
      { updated_at: :desc, created_at: :desc }
    when 'oldest'
      { updated_at: :asc, created_at: :asc }
    else
      { _score: :desc, updated_at: :desc, created_at: :desc }
    end
  end

  def cleaned_query
    query.presence
  end
end
