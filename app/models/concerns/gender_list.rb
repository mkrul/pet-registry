module GenderList
  extend ActiveSupport::Concern

  included do
    GENDERS = JSON.parse(File.read(Rails.root.join('app/src/lib/reports/genderLists.json')))['options'].freeze
  end

  class_methods do
    def valid_genders
      GENDERS
    end
  end

  def validate_gender
    return unless gender.present?

    unless self.class.valid_genders.include?(gender)
      errors.add(:gender, "must be one of: #{self.class.valid_genders.join(', ')}")
    end
  end
end