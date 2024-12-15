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

  BREED_SYNONYMS = {
    'pit bull' => ['pitbull', 'staffordshire', 'staffy', 'amstaff', 'bully', 'bulldog'],
    'pitbull' => ['pitbull', 'staffordshire', 'staffy', 'amstaff', 'bully', 'bulldog'],
    'bulldog' => ['bulldog', 'pitbull', 'staffordshire', 'staffy', 'amstaff', 'bully'],
    'cat' => ['kitten', 'kitty', 'kitties', 'cats'],
    'dog' => ['puppy', 'puppies', 'dogs'],
  }

  def execute
    search_options = {
      where: where_conditions,
      page: page,
      per_page: per_page,
      order: sort_order
    }

    Rails.logger.debug "Search options: #{search_options.inspect}"

    # Add debug logging to see what's in the index
    Rails.logger.debug "Sample reports in index:"
    sample_reports = Report.search("*", where: { status: 'active' }, limit: 5)
    sample_reports.each do |report|
      Rails.logger.debug "Report #{report.id}: #{report.search_data.inspect}"
    end

    if query.present?
      search_options[:fields] = ["breed_1^10", "breed_2^10", "description^5", "title^2", "color_1^2", "color_2^2", "color_3^2"]
      search_options[:match] = :word_middle
      search_options[:misspellings] = { below: 2 }
      search_options[:operator] = "or"

      # Create an array of search terms including the original query and its synonyms
      search_terms = [query.downcase]
      BREED_SYNONYMS.each do |breed, synonyms|
        if query.downcase.include?(breed)
          search_terms.concat(synonyms)
        end
      end

      # Force species based on animal-related keywords in the query
      cat_keywords = %w[cat cats kitty kittens kitties]
      dog_keywords = %w[dog dogs puppy puppies]

      query_downcase = query.downcase
      if cat_keywords.any? { |keyword| query_downcase.include?(keyword) }
        search_options[:where][:species] = 'cat'
      elsif dog_keywords.any? { |keyword| query_downcase.include?(keyword) }
        search_options[:where][:species] = 'dog'
      end

      # Use the query directly instead of wrapping it in a hash
      Report.search(query_downcase, **search_options)
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

    # Add country condition
    if country.present?
      conditions[:country] = country
      Rails.logger.debug "  Added country filter: #{country}"
    end

    # Add state condition
    if state.present?
      conditions[:state] = state
      Rails.logger.debug "  Added state filter: #{state}"
    end

    # Add city condition
    if city.present?
      conditions[:city] = city
      Rails.logger.debug "  Added city filter: #{city}"
    end

    # Only set species from param if "cat" or "dog" is not in query
    if !query&.downcase&.include?('cat') && !query&.downcase&.include?('dog') && species.present?
      conditions[:species] = species.downcase
    end

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

    Rails.logger.debug "[Search] Final conditions: #{conditions.inspect}"
    conditions
  end

  def sort_order
    case sort&.downcase
    when 'oldest'
      { updated_at: :asc, created_at: :asc }
    when 'newest'
      { updated_at: :desc, created_at: :desc }
    else
      if query.present?
        [{ _score: :desc }, { updated_at: :desc }]
      else
        { updated_at: :desc, created_at: :desc }
      end
    end
  end
end
