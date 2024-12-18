require 'active_interaction'

class Reports::Search < ActiveInteraction::Base
  string :query, default: nil
  string :species, default: nil
  string :color, default: nil
  string :gender, default: nil
  string :state, default: nil
  string :city, default: nil
  string :country, default: nil
  string :sort, default: nil
  integer :page, default: 1
  integer :per_page, default: Report::REPORT_PAGE_LIMIT
  string :breed, default: nil

  BREED_SYNONYMS = {
    'pit bull' => ['pitbull', 'staffordshire', 'staffy', 'amstaff', 'bully', 'bulldog'],
    'pitbull' => ['pitbull', 'staffordshire', 'staffy', 'amstaff', 'bully', 'bulldog'],
    'bulldog' => ['bulldog', 'pitbull', 'staffordshire', 'staffy', 'amstaff', 'bully'],
    'cat' => ['kitten', 'kitty', 'kitties', 'cats'],
    'dog' => ['puppy', 'puppies', 'dogs'],
  }

  def execute
    Rails.logger.debug "[Search] Received parameters:"
    Rails.logger.debug "  Query: #{query.inspect}"
    Rails.logger.debug "  Species: #{species.inspect}"
    Rails.logger.debug "  Color: #{color.inspect}"
    Rails.logger.debug "  Gender: #{gender.inspect}"
    Rails.logger.debug "  Country: #{country.inspect}"
    Rails.logger.debug "  State: #{state.inspect}"
    Rails.logger.debug "  City: #{city.inspect}"
    Rails.logger.debug "  Sort: #{sort.inspect}"
    Rails.logger.debug "  Page: #{page.inspect}"
    Rails.logger.debug "  Per page: #{per_page.inspect}"

    search_options = {
      where: where_conditions,
      page: page,
      per_page: per_page,
      order: sort_order
    }

    Rails.logger.debug "[Search] Executing search with options:"
    Rails.logger.debug "  Where conditions: #{search_options[:where].inspect}"
    Rails.logger.debug "  Page: #{search_options[:page]}"
    Rails.logger.debug "  Per page: #{search_options[:per_page]}"
    Rails.logger.debug "  Order: #{search_options[:order].inspect}"

    # Add debug logging to see what's in the index
    Rails.logger.debug "Sample reports in index:"
    sample_reports = Report.search("*", where: { status: 'active' }, limit: 5)
    sample_reports.each do |report|
      Rails.logger.debug "Report #{report.id}: #{report.search_data.inspect}"
    end

    if query.present?
      # Detect species from query
      query_downcase = query.downcase
      if query_downcase.include?('cat') || query_downcase.include?('kitten')
        search_options[:where][:species] = 'cat'
        Rails.logger.debug "  Detected and filtering by species: cat"
      elsif query_downcase.include?('dog') || query_downcase.include?('puppy')
        search_options[:where][:species] = 'dog'
        Rails.logger.debug "  Detected and filtering by species: dog"
      end

      search_options[:fields] = ["breed_1^10", "breed_2^10", "description^5", "title^2", "color_1^2", "color_2^2", "color_3^2", "species^10"]
      search_options[:match] = :word_middle
      search_options[:misspellings] = { below: 2 }
      search_options[:operator] = "or"

      Rails.logger.debug "  Final search options: #{search_options.inspect}"
      Report.search(query.downcase, **search_options)
    else
      Report.search("*", **search_options)
    end
  end

  private

  def where_conditions
    conditions = { status: 'active' }

    Rails.logger.debug "[Search] Building filters:"
    Rails.logger.debug "  Species: #{species.inspect}"
    Rails.logger.debug "  Color: #{color.inspect}"
    Rails.logger.debug "  Gender: #{gender.inspect}"
    Rails.logger.debug "  Country: #{country.inspect}"
    Rails.logger.debug "  State: #{state.inspect}"
    Rails.logger.debug "  City: #{city.inspect}"
    Rails.logger.debug "  Query: #{query.inspect}"

    # Set species condition
    if species.present?
      conditions[:species] = species.downcase
      Rails.logger.debug "  Setting species to '#{species.downcase}' from filter"
    end

    # Add location conditions
    if country.present?
      conditions[:country] = country
      Rails.logger.debug "  Added country filter: #{country}"
    end

    if state.present?
      conditions[:state] = state
      Rails.logger.debug "  Added state filter: #{state}"
    end

    if city.present?
      conditions[:city] = city
      Rails.logger.debug "  Added city filter: #{city}"
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

    # Add breed condition
    if breed.present?
      breed_value = breed.downcase
      filters << {
        _or: [
          { breed_1: breed_value },
          { breed_2: breed_value }
        ]
      }
    end

    # Add other filters to conditions
    if filters.any?
      conditions[:_and] ||= []
      conditions[:_and].concat(filters)
    end

    Rails.logger.debug "[Search] Final conditions: #{conditions.inspect}"
    conditions
  end

  def sort_order
    case sort&.downcase
    when 'oldest'
      { created_at: :asc }
    else # 'newest' or default
      { created_at: :desc }
    end
  end
end
