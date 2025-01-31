module ColorValidations
  extend ActiveSupport::Concern
  include ColorList

  included do
    validate :unique_colors
  end

  private

  def unique_colors
    colors = [color_1, color_2, color_3].compact.reject(&:blank?)
    duplicates = colors.select { |color| colors.count(color) > 1 }.uniq

    if duplicates.any?
      errors.add(:base, "Each color must be unique. Duplicate colors found: #{duplicates.join(', ')}")
    end
  end
end