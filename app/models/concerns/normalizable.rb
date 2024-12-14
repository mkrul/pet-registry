# app/models/concerns/normalizable.rb

module Normalizable
  extend ActiveSupport::Concern

  included do
    before_validation :normalize_report
  end

  def normalize_report
    self.title = title&.strip&.presence
    self.description = description&.strip&.presence
    self.name = name&.strip&.presence
    self.species = species&.strip&.presence
    self.gender = gender&.strip&.presence
    self.breed_1 = breed_1&.strip&.presence
    self.breed_2 = breed_2&.strip&.presence
    self.color_1 = color_1&.strip&.presence
    self.color_2 = color_2&.strip&.presence
    self.color_3 = color_3&.strip&.presence
    self.status = status&.strip&.presence
    self.country = country&.strip&.presence
    self.microchipped = microchipped&.presence
    self.microchip_id = microchip_id&.strip&.presence
  end
end
