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
      match: :word_middle,
      page: page,
      per_page: per_page,
      order: sort_order,
      operator: "or",
      misspellings: { edit_distance: 2 },
      includes: [:image_attachment],
      load: false,
      body_options: { track_total_hits: true }
  end

  private

  def where_conditions
    conditions = { status: 'active' }

    conditions[:species] = species.downcase if species.present?

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

    conditions[:_and] = filters if filters.any?
    conditions
  end

  def search_fields
    if query.present?
      [
        "title^10",
        "description^5",
        "breed_1^3",
        "breed_2^3",
        "name^2"
      ]
    else
      ['title', 'description', 'breed_1', 'breed_2', 'name']
    end
  end

  def sort_order
    case sort&.downcase
    when 'oldest'
      { updated_at: :asc, created_at: :asc }
    when 'newest'
      { updated_at: :desc, created_at: :desc }
    else
      if query.present?
        [{ _score: :desc }, { updated_at: :desc, created_at: :desc }]
      else
        { updated_at: :desc, created_at: :desc }
      end
    end
  end
end
