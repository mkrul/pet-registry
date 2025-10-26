# frozen_string_literal: true

require 'active_interaction'

module Reports
  class Create < ActiveInteraction::Base
    string :title
    string :description
    string :species
    string :breed_1
    string :color_1
    string :area
    string :state
    string :country
    string :latitude
    string :longitude
    integer :user_id
    string :name, default: nil
    string :gender, default: nil
    string :breed_2, default: nil
    string :color_2, default: nil
    string :color_3, default: nil
    string :microchip_id, default: nil
    string :intersection, default: nil
    file :image, default: nil
    boolean :is_altered, default: nil

    def execute

      # Convert string inputs to appropriate types
      processed_inputs = inputs.to_h.dup
      processed_inputs[:is_altered] = case inputs[:is_altered]
                                     when 'true', '1', 1, true then true
                                     when 'false', '0', 0, false then false
                                     else nil
                                     end

      # Apply privacy offset to coordinates
      if processed_inputs[:latitude] && processed_inputs[:longitude]
        offset_coords = apply_privacy_offset(
          processed_inputs[:latitude].to_f,
          processed_inputs[:longitude].to_f
        )
        processed_inputs[:latitude] = offset_coords[:latitude]
        processed_inputs[:longitude] = offset_coords[:longitude]
      end

      report = Report.new(processed_inputs.merge(status: 'active'))

      unless report.save
        errors.merge!(report.errors)
        return nil
      end

      report
    end

    private

    def apply_privacy_offset(lat, lng)
      privacy_offset = 0.0025
      offset_lat = lat + (rand - 0.5) * privacy_offset
      offset_lng = lng + (rand - 0.5) * privacy_offset

      Rails.logger.info "[PRIVACY] Original coordinates: #{lat}, #{lng}"
      Rails.logger.info "[PRIVACY] Privacy offset applied: #{offset_lat}, #{offset_lng}"
      Rails.logger.info "[PRIVACY] Offset amount: lat #{(offset_lat - lat).round(6)}, lng #{(offset_lng - lng).round(6)}"

      { latitude: offset_lat, longitude: offset_lng }
    end
  end
end
