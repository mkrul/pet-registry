module SortList
  extend ActiveSupport::Concern

  included do
    SORT_OPTIONS = JSON.parse(File.read(Rails.root.join('app/src/lib/reports/sortLists.json')))['options'].freeze
  end

  class_methods do
    def valid_sort_options
      SORT_OPTIONS
    end

    def default_sort_option
      'Newest'
    end
  end
end