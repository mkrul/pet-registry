# frozen_string_literal: true

class Report < ApplicationRecord
  searchkick

  has_many_attached :images, dependent: :destroy

  validates :title, presence: true
  validates :description, presence: true
  validates :status, presence: true, inclusion: { in: %w[active archived] }
  validates :breed_1, presence: true
  validates :color_1, presence: true
  normalizes :title,
             :description,
             :status,
             :archived_at,
             :name,
             :species,
             :breed_1,
             :breed_2,
             :color_1,
             :color_2,
             :color_3,
             :gender,
             :microchipped,
             :microchip_id,
             with: ->(value) { value.presence || nil }

  validate :image_count_within_limit
  validate :image_size_within_limit

  has_many_attached :images, dependent: :destroy

  before_validation :normalize_fields

  REPORT_PAGE_LIMIT = 20

  private

  def normalize_fields
    self.title = title&.strip
    self.description = description&.strip
    self.name = name&.presence
    self.species = species&.presence
    self.breed_1 = breed_1&.presence
    self.breed_2 = breed_2&.presence
    self.color_1 = color_1&.presence
    self.color_2 = color_2&.presence
    self.color_3 = color_3&.presence
    self.status = status&.downcase
    self.microchipped = microchipped&.presence
    self.microchip_id = microchip_id&.presence
  end

  def image_count_within_limit
    return unless images.attached? && images.count > 3

    errors.add(:images, 'cannot exceed 3')
  end

  def image_size_within_limit
    return unless images.any? { |image| image.byte_size > 5.megabytes }

    errors.add(:images, 'cannot exceed 5MB')
  end
end
