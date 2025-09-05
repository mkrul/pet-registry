module BreedList
  extend ActiveSupport::Concern

  included do
    begin
      json_path = Rails.root.join('config/breeds.json')
      if File.exist?(json_path)
        file_content = File.read(json_path)
        BREEDS = JSON.parse(file_content).freeze
      else
        possible_paths = Dir.glob(Rails.root.join('**/*breedList.json'))
        BREEDS = {'dog' => [], 'cat' => []}.freeze
      end
    rescue => e
      BREEDS = {'dog' => [], 'cat' => []}.freeze
    end
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
    valid_breeds_downcased = valid_breeds.map(&:downcase)

    if breed_1.present? && !valid_breeds_downcased.include?(breed_1)
      errors.add(:breed_1, "is not a valid breed for #{species}")
    end

    if breed_2.present? && !valid_breeds_downcased.include?(breed_2)
      errors.add(:breed_2, "is not a valid breed for #{species}")
    end
  end
end