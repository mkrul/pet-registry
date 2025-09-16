# frozen_string_literal: true

require 'active_interaction'
require 'tempfile'

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
    integer :pet_id, default: nil

    def execute
      Rails.logger.info("Create service inputs: #{inputs.inspect}")

      # Convert string inputs to appropriate types
      processed_inputs = inputs.to_h.dup
      processed_inputs[:is_altered] = case inputs[:is_altered]
                                     when 'true', '1', 1, true then true
                                     when 'false', '0', 0, false then false
                                     else nil
                                     end

      # Handle pet image copying if pet_id is provided
      temp_file = nil
      if inputs[:pet_id].present? && inputs[:image].blank?
        pet = Pet.find_by(id: inputs[:pet_id], user_id: inputs[:user_id])
        if pet&.image&.attached?
          # Download the pet's image and create a new file for the report
          begin
            temp_file = Tempfile.new(['pet_image', '.jpg'])
            temp_file.binmode
            pet.image.download do |chunk|
              temp_file.write(chunk)
            end
            temp_file.rewind

            # Create a new file object for the report
            processed_inputs[:image] = temp_file
          rescue => e
            Rails.logger.error("Failed to copy pet image: #{e.message}")
            # Continue without image if copying fails
          end
        end
      end

      # Remove pet_id from processed_inputs as it's not a Report attribute
      processed_inputs.delete(:pet_id)

      report = Report.new(processed_inputs.merge(status: 'active'))
      Rails.logger.info("Report before save: #{report.attributes.inspect}")

      unless report.save
        Rails.logger.error("Report save failed: #{report.errors.full_messages}")
        errors.merge!(report.errors)
        temp_file&.close&.unlink
        return nil
      end

      # Clean up temp file after successful save
      temp_file&.close&.unlink

      Rails.logger.info("Report after save: #{report.attributes.inspect}")
      report
    end
  end
end
