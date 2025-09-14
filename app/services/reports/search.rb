require 'active_interaction'
require_relative '../paginated_collection'

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
  integer :per_page, default: Report::REPORT_INDEX_PAGE_LIMIT
  string :breed, default: nil

  def execute
    search_options = {
      where: where_conditions,
      page: page,
      per_page: per_page,
      order: sort_order
    }

    if query.present?
      search_query = query.downcase

      # Use Elasticsearch for all searches with different strategies based on content
      if contains_breed_terms?(search_query)
        # For breed searches, use higher breed weights and exclude species field
        elasticsearch_search(search_query, search_options, breed_search: true)
      else
        # For general searches, use standard weights and include species field
        elasticsearch_search(search_query, search_options, breed_search: false)
      end
    else
      # No query provided, return all active reports using match_all query
      elasticsearch_search_all(search_options)
    end
  end

  private

  def where_conditions
    conditions = { status: 'active' }

    # Determine species from explicit parameter or keyword detection
    target_species = species.present? ? species.downcase : detect_species_from_query

    if target_species.present?
      conditions[:species] = target_species
    end

    if country.present?
      conditions[:country] = country
    end

    if state.present?
      conditions[:state] = state
    end

    if area.present?
      conditions[:area] = area
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

    if breed.present?
      breed_value = breed.downcase
      filters << {
        _or: [
          { breed_1: breed_value },
          { breed_2: breed_value }
        ]
      }
    end

    if filters.any?
      conditions[:_and] ||= []
      conditions[:_and].concat(filters)
    end

    Rails.logger.debug "Where conditions: #{conditions.inspect}"
    conditions
  end

  def sort_order
    case sort&.downcase
    when 'oldest'
      { created_at: :asc }
    when 'recently updated'
      { updated_at: :desc }
    else
      { created_at: :desc }
    end
  end

  def detect_species_from_query
    return nil unless query.present?

    search_query = query.downcase

    # Cat keywords
    cat_keywords = %w[cat cats kitty kitten kittens]
    return 'cat' if cat_keywords.any? { |keyword| search_query.include?(keyword) }

    # Dog keywords
    dog_keywords = %w[dog dogs doggie doggy doggies puppy puppies]
    return 'dog' if dog_keywords.any? { |keyword| search_query.include?(keyword) }

    nil
  end

  def contains_breed_terms?(search_query)
    # Get all valid breeds from the breed list
    all_breeds = Report.all_breeds.map(&:downcase)

    all_breeds_words = all_breeds.flat_map { |breed| breed.split(/\s+/) }
    return true if all_breeds_words.any? { |breed| search_query.include?(breed) }

    # Extract significant words from all breed names (2+ characters, excluding common words)
    breed_words = all_breeds.flat_map { |breed| breed.split(/\s+/) }
                           .select { |word| word.length > 2 && !%w[the and dog cat].include?(word) }
                           .uniq

    # Check if any significant breed word appears in the search query
    breed_words.any? { |word| search_query.include?(word) }
  end

  def elasticsearch_client
    # Create Elasticsearch client based on environment configuration
    if Rails.env.production? && Rails.application.credentials.dig(Rails.env.to_sym, :bonsai, :url).present?
      Elasticsearch::Client.new(url: Rails.application.credentials.dig(Rails.env.to_sym, :bonsai, :url))
    elsif Rails.application.credentials.dig(Rails.env.to_sym, :elasticsearch, :url).present?
      Elasticsearch::Client.new(url: Rails.application.credentials.dig(Rails.env.to_sym, :elasticsearch, :url))
    else
      Elasticsearch::Client.new(url: ENV['ELASTICSEARCH_URL'] || 'http://localhost:9200')
    end
  end

  def build_elasticsearch_filters(conditions)
    filters = []

    Rails.logger.debug "Building Elasticsearch filters from: #{conditions.inspect}"

    # Fields that are filterable (exact match) vs searchable (analyzed)
    filterable_fields = %w[status species gender country state area]

    conditions.each do |key, value|
      case key
      when :_and
        # Handle complex AND conditions (like gender, color, breed filters)
        value.each do |condition|
          if condition[:_or]
            # Convert _or conditions to Elasticsearch should clauses
            or_conditions = condition[:_or].map do |or_condition|
              or_condition.map do |field, field_value|
                field_name = filterable_fields.include?(field.to_s) ? field.to_s : "#{field}.analyzed"
                { term: { field_name => field_value } }
              end
            end.flatten
            filters << { bool: { should: or_conditions, minimum_should_match: 1 } }
          else
            # Simple field conditions
            condition.each do |field, field_value|
              field_name = filterable_fields.include?(field.to_s) ? field.to_s : "#{field}.analyzed"
              filters << { term: { field_name => field_value } }
            end
          end
        end
      else
        # Simple field conditions
        field_name = filterable_fields.include?(key.to_s) ? key.to_s : "#{key}.analyzed"
        filters << { term: { field_name => value } }
      end
    end

    Rails.logger.debug "Built Elasticsearch filters: #{filters.inspect}"
    filters
  end

  def elasticsearch_search(search_query, search_options, breed_search: false)
    # Build Elasticsearch query with different field configurations
    fields = if breed_search
      # For breed searches, exclude species field and use higher breed weights
      [
        "breed_1.analyzed^100",
        "breed_2.analyzed^100",
        "description.analyzed^20",
        "title.analyzed^15",
        "color_1.analyzed^5",
        "color_2.analyzed^5",
        "color_3.analyzed^5"
      ]
    else
      # For general searches, include species field with standard weights
      [
        "breed_1.analyzed^10",
        "breed_2.analyzed^10",
        "description.analyzed^10",
        "title.analyzed^10",
        "color_1.analyzed^5",
        "color_2.analyzed^5",
        "color_3.analyzed^5",
        "species.analyzed^1"
      ]
    end

    es_query = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: search_query,
                fields: fields,
                type: "best_fields",
                operator: "or"
              }
            }
          ],
          filter: build_elasticsearch_filters(where_conditions)
        }
      },
      sort: sort_order,
      from: (search_options[:page] - 1) * search_options[:per_page],
      size: search_options[:per_page]
    }

    # Execute Elasticsearch query
    client = elasticsearch_client
    index_name = "reports_#{Rails.env}"

    response = client.search(
      index: index_name,
      body: es_query
    )

    # Convert Elasticsearch response to paginated collection
    hits = response['hits']['hits']
    total = response['hits']['total']['value']

    # Load the actual Report objects in the correct order with image attachments
    report_ids = hits.map { |hit| hit['_id'].to_i }
    reports = Report.includes(image_attachment: :blob).where(id: report_ids).index_by(&:id)
    ordered_reports = report_ids.map { |id| reports[id] }.compact

    # Return paginated collection
    PaginatedCollection.new(
      ordered_reports,
      total: total,
      page: search_options[:page],
      per_page: search_options[:per_page]
    )
  end

  def elasticsearch_search_all(search_options)
    # Build Elasticsearch query to return all active reports
    es_query = {
      query: {
        bool: {
          must: [
            {
              match_all: {}
            }
          ],
          filter: build_elasticsearch_filters(where_conditions)
        }
      },
      sort: sort_order,
      from: (search_options[:page] - 1) * search_options[:per_page],
      size: search_options[:per_page]
    }

    # Execute Elasticsearch query
    client = elasticsearch_client
    index_name = "reports_#{Rails.env}"

    response = client.search(
      index: index_name,
      body: es_query
    )

    # Convert Elasticsearch response to paginated collection
    hits = response['hits']['hits']
    total = response['hits']['total']['value']

    # Load the actual Report objects in the correct order with image attachments
    report_ids = hits.map { |hit| hit['_id'].to_i }
    reports = Report.includes(image_attachment: :blob).where(id: report_ids).index_by(&:id)
    ordered_reports = report_ids.map { |id| reports[id] }.compact

    # Return paginated collection
    PaginatedCollection.new(
      ordered_reports,
      total: total,
      page: search_options[:page],
      per_page: search_options[:per_page]
    )
  end

end
