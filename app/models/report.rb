# app/models/report.rb

# frozen_string_literal: true

class Report < ApplicationRecord
  searchkick

  validates :title, presence: true, length: { maximum: 30 }
  validates :name, length: { maximum: 30 }
  validates :description, presence: true, length: { maximum: 500 }
  validates :status, presence: true, inclusion: { in: %w[active archived] }
  validates :breed_1, presence: true
  validates :color_1, presence: true
  validates :microchip_id, uniqueness: { allow_nil: true }, length: { maximum: 35 }

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

  validate :image_size_within_limit?

  has_one_attached :image, dependent: :destroy

  before_validation :normalize_fields

  REPORT_PAGE_LIMIT = 20
  CLOUDINARY_REPORT_FOLDER = "#{Rails.env}/reports"

  private

  def normalize_fields
    self.title = title&.strip
    self.description = description&.strip
    self.name = name&.presence
    self.species = species&.presence&.downcase
    self.breed_1 = breed_1&.presence
    self.breed_2 = breed_2&.presence
    self.color_1 = color_1&.strip&.downcase
    self.color_2 = color_2&.strip&.downcase
    self.color_3 = color_3&.strip&.downcase
    self.status = status&.downcase
    self.microchipped = microchipped&.presence
    self.microchip_id = microchip_id&.presence
  end

  def image_attached?
    errors.add(:image, 'could not be processed') unless image.attached?
  end

  def image_size_within_limit?
    errors.add(:image, 'size cannot exceed 5MB') if image.attached? && image.blob.byte_size > 5.megabytes
  end
end
