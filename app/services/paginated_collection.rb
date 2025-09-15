# Simple paginated collection that mimics Searchkick results interface
class PaginatedCollection
  include Enumerable

  attr_reader :collection, :total, :page, :per_page

  def initialize(collection, total:, page:, per_page:)
    @collection = collection
    @total = total
    @page = page
    @per_page = per_page
  end

  def each(&block)
    collection.each(&block)
  end

  def empty?
    collection.empty?
  end

  def total_entries
    total
  end

  def total_pages
    (total.to_f / per_page).ceil
  end

  def current_page
    page
  end

  def per_page
    @per_page
  end

  # ActiveModelSerializers compatibility
  def model_name
    ActiveModel::Name.new(self.class, nil, "PaginatedCollection")
  end

  def persisted?
    false
  end

  def to_key
    nil
  end

  def to_param
    nil
  end
end
