module SpeciesList
  extend ActiveSupport::Concern

  included do
    SPECIES = JSON.parse(File.read(Rails.root.join('app/src/lib/reports/speciesLists.json')))['options'].freeze
  end

  class_methods do
    def valid_species
      SPECIES
    end
  end

  def validate_species
    return unless species.present?

    unless self.class.valid_species.include?(species)
      errors.add(:species, "must be one of: #{self.class.valid_species.join(', ')}")
    end
  end
end