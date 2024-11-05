# app/models/concerns/normalizable.rb

module Normalizable
  extend ActiveSupport::Concern

  included do
    before_validation :normalize_report
  end

  def normalize_report
    self.title = title&.strip
    self.description = description&.strip
    self.name = name&.presence
    self.species = species&.strip&.downcase
    self.breed_1 = breed_1&.strip
    self.breed_2 = breed_2&.strip
    self.color_1 = color_1&.strip&.downcase
    self.color_2 = color_2&.strip&.downcase
    self.color_3 = color_3&.strip&.downcase
    self.status = status&.strip&.downcase
    self.microchipped = microchipped&.presence
    self.microchip_id = microchip_id&.strip
  end
end
