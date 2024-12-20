module SortList
  extend ActiveSupport::Concern

  included do
    SORT_OPTIONS = JSON.parse(File.read(Rails.root.join('config/sort_options.json')))['options'].freeze
  end

  class_methods do
    def valid_sort_options
      SORT_OPTIONS
    end
  end
end