# frozen_string_literal: true

class Report < ApplicationRecord
  searchkick

  has_many_attached :images, dependent: :destroy

  validates :title, presence: true
  validates :description, presence: true
  validates :status, presence: true, inclusion: { in: %w[active archived] }
  validates :breed_1, presence: true
  validates :species, presence: true, inclusion: { in: %w[dog cat] }
  validates :gender, presence: true, inclusion: { in: %w[male female unknown] }
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
             with: -> { _1.presence }

  validate :image_count_within_limit
  validate :image_size_within_limit

  private

  def image_count_within_limit
    return unless images.attached? && images.count > 3

    errors.add(:images, 'cannot exceed 3')
  end

  def image_size_within_limit
    return unless images.any? { |image| image.byte_size > 5.megabytes }

    errors.add(:images, 'cannot exceed 5MB')
  end
end
