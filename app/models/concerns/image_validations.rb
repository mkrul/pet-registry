module ImageValidations
  extend ActiveSupport::Concern

  included do
    VALID_IMAGE_TYPES = %w[image/jpeg image/png image/gif].freeze
    MAX_IMAGE_SIZE = 5.megabytes

    validate :image_size_within_limit?
    validate :validate_image_format
  end

  private

  def image_size_within_limit?
    if image.attached? && image.blob.byte_size > MAX_IMAGE_SIZE
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