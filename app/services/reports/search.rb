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

      # Remove species keywords from search query if they're being used for filtering
      cleaned_search_query = remove_species_keywords_from_query(search_query)
      Rails.logger.debug "Original query: '#{search_query}', cleaned query: '#{cleaned_search_query}'"

      # If cleaned query is empty, use match_all query with filters
      if cleaned_search_query.blank?
        Rails.logger.debug "Cleaned query is empty, using match_all query with filters"
        elasticsearch_search_all(search_options)
      else
        # Use Elasticsearch for all searches with different strategies based on content
        is_breed_search = contains_breed_terms?(cleaned_search_query)
        Rails.logger.debug "Cleaned search query: '#{cleaned_search_query}', is_breed_search: #{is_breed_search}"

        if is_breed_search
          # For breed searches, use higher breed weights and exclude species field
          elasticsearch_search(cleaned_search_query, search_options, breed_search: true)
        else
          # For general searches, use standard weights and include species field
          elasticsearch_search(cleaned_search_query, search_options, breed_search: false)
        end
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
      Rails.logger.debug "Species filter applied: #{target_species}"
    end

    if country.present?
      conditions[:country] = country.downcase
    end

    if state.present?
      conditions[:state] = state.downcase
    end

    if area.present?
      conditions[:area] = area.downcase
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

    # Cat keywords - check for cat-related terms
    cat_keywords = %w[cat cats kitty kitten kittens feline]
    if cat_keywords.any? { |keyword| search_query.include?(keyword) }
      Rails.logger.debug "Detected cat species from query: '#{search_query}'"
      return 'cat'
    end

    # Dog keywords - check for dog-related terms
    dog_keywords = %w[dog dogs doggie doggy doggies puppy puppies canine]
    if dog_keywords.any? { |keyword| search_query.include?(keyword) }
      Rails.logger.debug "Detected dog species from query: '#{search_query}'"
      return 'dog'
    end

    Rails.logger.debug "No species detected from query: '#{search_query}'"
    nil
  end

  def remove_species_keywords_from_query(search_query)
    return search_query unless search_query.present?

    # Only remove species keywords if they're being used for filtering
    # (i.e., if no explicit species parameter was provided)
    return search_query if species.present?

    cleaned_query = search_query.dup

    # Remove cat keywords
    cat_keywords = %w[cat cats kitty kitten kittens feline]
    cat_keywords.each do |keyword|
      # Remove the keyword and any surrounding whitespace
      cleaned_query = cleaned_query.gsub(/\b#{Regexp.escape(keyword)}\b/, '').strip
    end

    # Remove dog keywords
    dog_keywords = %w[dog dogs doggie doggy doggies puppy puppies canine]
    dog_keywords.each do |keyword|
      # Remove the keyword and any surrounding whitespace
      cleaned_query = cleaned_query.gsub(/\b#{Regexp.escape(keyword)}\b/, '').strip
    end

    # Clean up multiple spaces and return
    cleaned_query.gsub(/\s+/, ' ').strip
  end

  def contains_breed_terms?(search_query)
    # Get all valid breeds from the breed list
    all_breeds = Report.all_breeds.map(&:downcase)

    # First check for exact breed matches (including compound breeds like "pit bull")

    return true if all_breeds.any? { |breed| search_query.include?(breed) }

    # Then check for individual breed words (2+ characters, excluding common words)
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
        "breed_1.analyzed^200",
        "breed_2.analyzed^200",
        "description.analyzed^20",
        "title.analyzed^15",
        "color_1.analyzed^5",
        "color_2.analyzed^5",
        "color_3.analyzed^5"
      ]
    else
      # For general searches, include species field with standard weights
      [
        "breed_1.analyzed^20",
        "breed_2.analyzed^20",
        "description.analyzed^10",
        "title.analyzed^10",
        "color_1.analyzed^5",
        "color_2.analyzed^5",
        "color_3.analyzed^5",
        "species.analyzed^1"
      ]
    end

    # Build a more sophisticated query for breed searches
    if breed_search
      es_query = {
        query: {
          bool: {
            should: [
              # Exact phrase match for breed fields (highest priority)
              {
                multi_match: {
                  query: search_query,
                  fields: ["breed_1.analyzed^500", "breed_2.analyzed^500"],
                  type: "phrase",
                  boost: 3.0
                }
              },
              # Best fields match for breed fields (high priority)
              {
                multi_match: {
                  query: search_query,
                  fields: ["breed_1.analyzed^200", "breed_2.analyzed^200"],
                  type: "best_fields",
                  operator: "and"
                }
              },
              # General multi-match for all fields
              {
                multi_match: {
                  query: search_query,
                  fields: fields,
                  type: "best_fields",
                  operator: "or"
                }
              }
            ],
            minimum_should_match: 1,
            filter: build_elasticsearch_filters(where_conditions)
          }
        },
        sort: sort_order,
        from: (search_options[:page] - 1) * search_options[:per_page],
        size: search_options[:per_page]
      }
    else
      # Standard query for non-breed searches
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
    end

    # Execute Elasticsearch query
    client = elasticsearch_client
    index_name = "reports_#{Rails.env}"

    Rails.logger.debug "Elasticsearch query: #{es_query.to_json}"

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
