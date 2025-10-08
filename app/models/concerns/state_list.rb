module StateList
  extend ActiveSupport::Concern

  included do
    STATES = JSON.parse(File.read(Rails.root.join('config/states.json')))['options'].freeze
  end

  class_methods do
    def valid_states
      STATES
    end
  end

  def validate_state
    return if state.blank?

    unless self.class.valid_states.map(&:downcase).include?(state.downcase)
      errors.add(:state, "must be one of: #{self.class.valid_states.join(', ')}")
    end
  end
end