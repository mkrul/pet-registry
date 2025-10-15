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

      cleaned_search_query = remove_species_keywords_from_query(search_query)
      cleaned_search_query = remove_gender_keywords_from_query(cleaned_search_query)

      if cleaned_search_query.blank?
        elasticsearch_search_all(search_options)
      else
        is_breed_search = contains_breed_terms?(cleaned_search_query)

        if is_breed_search
          elasticsearch_search(cleaned_search_query, search_options, breed_search: true)
        else
          elasticsearch_search(cleaned_search_query, search_options, breed_search: false)
        end
      end
    else
      elasticsearch_search_all(search_options)
    end
  end

  private

  def where_conditions
    conditions = { status: 'active' }

    target_species = species.present? ? species.downcase : detect_species_from_query

    if target_species.present?
      conditions[:species] = target_species
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

    target_gender = gender.present? ? gender.downcase : detect_gender_from_query

    if target_gender.present?
      filters << {
        _or: [
          { gender: target_gender },
          { gender: "#{target_gender} (intact)" },
          { gender: "#{target_gender} (neutered)" },
          { gender: "#{target_gender} (spayed)" },
          { gender: nil },
          { gender: "" }
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

    cat_keywords = %w[cat cats kitty kitten kittens feline]
    if cat_keywords.any? { |keyword| search_query.include?(keyword) }
      return 'cat'
    end

    dog_keywords = %w[dog dogs doggie doggy doggies puppy puppies canine]
    if dog_keywords.any? { |keyword| search_query.include?(keyword) }
      return 'dog'
    end

    nil
  end

  def detect_gender_from_query
    return nil unless query.present?

    search_query = query.downcase

    male_keywords = %w[male boy]
    if male_keywords.any? { |keyword| search_query.include?(keyword) }
      return 'male'
    end

    female_keywords = %w[female girl]
    if female_keywords.any? { |keyword| search_query.include?(keyword) }
      return 'female'
    end

    nil
  end

  def remove_species_keywords_from_query(search_query)
    return search_query unless search_query.present?

    return search_query if species.present?

    cleaned_query = search_query.dup

    cat_keywords = %w[cat cats kitty kitten kittens feline]
    cat_keywords.each do |keyword|
      cleaned_query = cleaned_query.gsub(/\b#{Regexp.escape(keyword)}\b/, '').strip
    end

    dog_keywords = %w[dog dogs doggie doggy doggies puppy puppies canine]
    dog_keywords.each do |keyword|
      cleaned_query = cleaned_query.gsub(/\b#{Regexp.escape(keyword)}\b/, '').strip
    end

    cleaned_query.gsub(/\s+/, ' ').strip
  end

  def remove_gender_keywords_from_query(search_query)
    return search_query unless search_query.present?

    return search_query if gender.present?

    cleaned_query = search_query.dup

    male_keywords = %w[male boy]
    male_keywords.each do |keyword|
      cleaned_query = cleaned_query.gsub(/\b#{Regexp.escape(keyword)}\b/, '').strip
    end

    female_keywords = %w[female girl]
    female_keywords.each do |keyword|
      cleaned_query = cleaned_query.gsub(/\b#{Regexp.escape(keyword)}\b/, '').strip
    end

    cleaned_query.gsub(/\s+/, ' ').strip
  end

  def contains_breed_terms?(search_query)
    all_breeds = Report.all_breeds.map(&:downcase)


    return true if all_breeds.any? { |breed| search_query.include?(breed) }

    breed_words = all_breeds.flat_map { |breed| breed.split(/\s+/) }
                           .select { |word| word.length > 2 && !%w[the and dog cat].include?(word) }
                           .uniq

    breed_words.any? { |word| search_query.include?(word) }
  end

  def elasticsearch_client
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


    filterable_fields = %w[status species gender country state area]

    conditions.each do |key, value|
      case key
      when :_and
        value.each do |condition|
          if condition[:_or]
            or_conditions = condition[:_or].map do |or_condition|
              or_condition.map do |field, field_value|
                field_name = filterable_fields.include?(field.to_s) ? field.to_s : "#{field}.analyzed"

                if field_value.nil?
                  { bool: { must_not: { exists: { field: field_name } } } }
                elsif field_value == ""
                  { bool: { should: [
                    { bool: { must_not: { exists: { field: field_name } } } },
                    { term: { field_name => "" } }
                  ], minimum_should_match: 1 } }
                else
                  { term: { field_name => field_value } }
                end
              end
            end.flatten
            filters << { bool: { should: or_conditions, minimum_should_match: 1 } }
          else
            condition.each do |field, field_value|
              field_name = filterable_fields.include?(field.to_s) ? field.to_s : "#{field}.analyzed"
              filters << { term: { field_name => field_value } }
            end
          end
        end
      else
        field_name = filterable_fields.include?(key.to_s) ? key.to_s : "#{key}.analyzed"
        filters << { term: { field_name => value } }
      end
    end

    filters
  end

  def elasticsearch_search(search_query, search_options, breed_search: false)
    fields = if breed_search
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

    if breed_search
      es_query = {
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: search_query,
                  fields: ["breed_1.analyzed^500", "breed_2.analyzed^500"],
                  type: "phrase",
                  boost: 3.0
                }
              },
              {
                multi_match: {
                  query: search_query,
                  fields: ["breed_1.analyzed^200", "breed_2.analyzed^200"],
                  type: "best_fields",
                  operator: "and"
                }
              },
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

    client = elasticsearch_client
    index_name = "reports_#{Rails.env}"


    response = client.search(
      index: index_name,
      body: es_query
    )

    hits = response['hits']['hits']
    total = response['hits']['total']['value']

    report_ids = hits.map { |hit| hit['_id'].to_i }
    reports = Report.includes(image_attachment: :blob).where(id: report_ids).index_by(&:id)
    ordered_reports = report_ids.map { |id| reports[id] }.compact

    PaginatedCollection.new(
      ordered_reports,
      total: total,
      page: search_options[:page],
      per_page: search_options[:per_page]
    )
  end

  def elasticsearch_search_all(search_options)
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

    client = elasticsearch_client
    index_name = "reports_#{Rails.env}"

    response = client.search(
      index: index_name,
      body: es_query
    )

    hits = response['hits']['hits']
    total = response['hits']['total']['value']

    report_ids = hits.map { |hit| hit['_id'].to_i }
    reports = Report.includes(image_attachment: :blob).where(id: report_ids).index_by(&:id)
    ordered_reports = report_ids.map { |id| reports[id] }.compact

    PaginatedCollection.new(
      ordered_reports,
      total: total,
      page: search_options[:page],
      per_page: search_options[:per_page]
    )
  end

end
