module PetValidations
  extend ActiveSupport::Concern

  included do
    validates :name, presence: { message: "cannot be blank" },
                     length: { maximum: 30, message: "must be 30 characters or less" },
                     format: { with: /\A[a-zA-Z0-9\s\-]+\z/, message: "can only contain letters, numbers, spaces, and hyphens" }

    validates :species, presence: { message: "cannot be blank" },
                        inclusion: { in: %w[dog cat], message: "must be either dog or cat" }

    validates :breed_1, presence: { message: "cannot be blank" }

    validates :color_1, presence: { message: "cannot be blank" }

    validates :microchip_id, uniqueness: { allow_nil: true, message: "is already registered" },
                             length: { maximum: 35, message: "must be 35 characters or less" },
                             format: { with: /\A[A-Za-z0-9\-]+\z/, message: "can only contain letters, numbers, and hyphens" },
                             allow_blank: true,
                             allow_nil: true

    validates :is_altered, inclusion: { in: [true, false], allow_nil: true },
                           allow_blank: true,
                           allow_nil: true

    validates :gender, inclusion: { in: %w[male female], message: "must be either Male or Female" },
                       allow_blank: true,
                       allow_nil: true

    validates :image, presence: { message: "is required" }

    validate :validate_breeds
    validate :validate_gender
    validate :image_size_within_limit?
    validate :validate_image_format
  end

  private

  VALID_IMAGE_TYPES = %w[image/jpeg image/png image/gif].freeze
  MAX_IMAGE_SIZE = 5.megabytes

  def image_size_within_limit?
    return unless image.attached?

    if image.blob.byte_size > MAX_IMAGE_SIZE
      errors.add(:image, "must be less than 5MB")
    end
  end

  def validate_image_format
    return unless image.attached?

    unless VALID_IMAGE_TYPES.include?(image.content_type)
      errors.add(:image, "must be a JPEG, PNG, or GIF")
    end
  end
end
