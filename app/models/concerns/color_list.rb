module ColorList
  extend ActiveSupport::Concern

  included do
    COLORS = JSON.parse(File.read(Rails.root.join('config/colors.json')))['options'].freeze
  end

  def validate_colors
    return unless [color_1, color_2, color_3].any?(&:present?)

    [color_1, color_2, color_3].compact.each do |color|
      unless self.class.valid_colors.include?(color)
        errors.add(:base, "#{color} is not a valid color")
      end
    end
  end

  class_methods do
    def valid_colors
      COLORS
    end
  end
end