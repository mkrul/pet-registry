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
      ActiveRecord::Base.transaction do
        # Convert string inputs to appropriate types
        processed_inputs = inputs.to_h.dup
        processed_inputs[:is_altered] = case inputs[:is_altered]
                                       when 'true', '1', 1, true then true
                                       when 'false', '0', 0, false then false
                                       else nil
                                       end

        # Remove location fields from report attributes
        report_attributes = processed_inputs.except(:area, :state, :country, :latitude, :longitude, :intersection)

        report = Report.new(report_attributes.merge(status: 'active'))

        unless report.save
          errors.merge!(report.errors)
          return nil
        end

        Event.create_report_created(eventable: report, user: User.find(user_id))

        # Create initial tip event with location data if provided
        if area.present? && country.present? && latitude.present? && longitude.present?
          offset_coords = apply_privacy_offset(latitude.to_f, longitude.to_f)

          tip_data = {
            message: 'Initial location when reported',
            area: area,
            state: state,
            country: country,
            latitude: offset_coords[:latitude].to_s,
            longitude: offset_coords[:longitude].to_s
          }
          tip_data[:intersection] = intersection if intersection.present?

          tip = Event.new(
            eventable: report,
            user: User.find(user_id),
            category: Events::Report::Tip::CATEGORY,
            data: tip_data,
            created_at: report.created_at,
            updated_at: report.created_at
          )

          unless tip.save
            Rails.logger.error "Failed to create initial tip for report #{report.id}: #{tip.errors.full_messages.join(', ')}"
            errors.add(:base, "Failed to create location tip: #{tip.errors.full_messages.join(', ')}")
            raise ActiveRecord::Rollback
          end
        end

        report
      end
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
