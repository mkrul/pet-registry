module ColorList
  extend ActiveSupport::Concern

  included do
    COLORS = JSON.parse(File.read(Rails.root.join('app/src/lib/reports/colorLists.json')))['options'].freeze
  end

  class_methods do
    def valid_colors
      COLORS
    end
  end

  def validate_colors
    return unless [color_1, color_2, color_3].any?(&:present?)

    [color_1, color_2, color_3].compact.each do |color|
      unless self.class.valid_colors.include?(color)
        errors.add(:base, "#{color} is not a valid color. Valid colors are: #{self.class.valid_colors.join(', ')}")
      end
    end
  end
end