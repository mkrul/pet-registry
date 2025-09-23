module GenderList
  extend ActiveSupport::Concern

  included do
    GENDERS = JSON.parse(File.read(Rails.root.join('app/src/shared/reports/genderList.json')))['options'].freeze
  end

  class_methods do
    def valid_genders
      GENDERS
    end
  end

  def validate_gender
    return if gender.blank?

    unless self.class.valid_genders.map(&:downcase).include?(gender.downcase)
      errors.add(:gender, "must be one of: #{self.class.valid_genders.join(', ')}")
    end
  end
end