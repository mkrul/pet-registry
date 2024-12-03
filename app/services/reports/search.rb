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
    Report.search(search_query, **search_options)
  end

  private

  def search_query
    cleaned_query.present? ? cleaned_query : '*'
  end

  def search_options
    options = {
      fields: [
        'title^3',
        'description^2',
        'breed_1^2',
        'breed_2^2',
        'color_1',
        'color_2',
        'color_3',
        'gender',
        'status'
      ],
      misspellings: { edit_distance: 2 },
      operator: 'or',
      where: where_conditions,
      page: page,
      per_page: per_page,
      order: sort_order
    }

    options.delete(:fields) unless cleaned_query.present?
    options
  end

  def where_conditions
    conditions = { status: 'active' }

    conditions[:species] = species.downcase if species.present?
    conditions[:gender] = gender.downcase if gender.present?

    if color.present?
      conditions[:or] = [
        { color_1: color.downcase },
        { color_2: color.downcase },
        { color_3: color.downcase }
      ]
    end

    conditions
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
