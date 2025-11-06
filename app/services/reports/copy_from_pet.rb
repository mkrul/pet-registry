# frozen_string_literal: true

require 'active_interaction'

module Reports
  class CopyFromPet < ActiveInteraction::Base
    record :pet, class: Pet
    hash :report_attributes, strip: false

    validate :pet_has_image

    def execute
      ActiveRecord::Base.transaction do
        new_report.image.attach(
          io: StringIO.new(pet.image.download),
          filename: pet.image.filename,
          content_type: pet.image.content_type
        )
        if new_report.save
          update_pet
          Event.create_report_created(eventable: new_report, user: pet.user)

          # Create initial tip event with location data if provided
          if report_attributes['area'].present? && report_attributes['country'].present? &&
             report_attributes['latitude'].present? && report_attributes['longitude'].present?
            offset_coords = apply_privacy_offset(
              report_attributes['latitude'].to_f,
              report_attributes['longitude'].to_f
            )

            tip_data = {
              message: 'Initial location when reported',
              area: report_attributes['area'],
              state: report_attributes['state'],
              country: report_attributes['country'],
              latitude: offset_coords[:latitude].to_s,
              longitude: offset_coords[:longitude].to_s
            }
            tip_data[:intersection] = report_attributes['intersection'] if report_attributes['intersection'].present?

            tip = Event.new(
              eventable: new_report,
              user: pet.user,
              category: Events::Report::Tip::CATEGORY,
              data: tip_data,
              created_at: new_report.created_at,
              updated_at: new_report.created_at
            )

            unless tip.save
              Rails.logger.error "Failed to create initial tip for report #{new_report.id}: #{tip.errors.full_messages.join(', ')}"
              errors.add(:base, "Failed to create location tip: #{tip.errors.full_messages.join(', ')}")
              raise ActiveRecord::Rollback
            end
          end

          new_report
        else
          errors.merge!(new_report.errors)
          nil
        end
      end
    rescue => e
      errors.add(:base, "Failed to copy pet image: #{e.message}")
      nil
    end

    private

    def new_report
      location_fields = [:area, :state, :country, :latitude, :longitude, :intersection]
      report_attrs_without_location = report_attributes.except(*location_fields.map(&:to_s))
      @new_report ||= Report.new(report_attrs_without_location.merge(status: 'active'))
    end

    def update_pet
      pet.update(report_id: new_report.id, status: Pet::STATUS_MISSING)
    end

    def pet_has_image
      errors.add(:base, "Pet must have an image") unless pet.image.attached?
    end

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
