module BreedList
  extend ActiveSupport::Concern

  included do
    BREEDS = JSON.parse(File.read(Rails.root.join('app/src/lib/reports/breedLists.json'))).freeze
  end

  class_methods do
    def valid_breeds_for(species)
      BREEDS[species.downcase] || []
    end

    def all_breeds
      BREEDS.values.flatten
    end
  end

  def validate_breeds
    return unless species.present?

    valid_breeds = self.class.valid_breeds_for(species)

    if breed_1.present? && !valid_breeds.include?(breed_1)
      errors.add(:breed_1, "is not a valid breed for #{species}")
    end

    if breed_2.present? && !valid_breeds.include?(breed_2)
      errors.add(:breed_2, "is not a valid breed for #{species}")
    end
  end
end