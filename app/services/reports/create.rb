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
      Rails.logger.info("Create service inputs: #{inputs.inspect}")

      # Convert string inputs to appropriate types
      processed_inputs = inputs.to_h.dup
      processed_inputs[:is_altered] = case inputs[:is_altered]
                                     when 'true', '1', 1, true then true
                                     when 'false', '0', 0, false then false
                                     else nil
                                     end

      report = Report.new(processed_inputs.merge(status: 'active'))
      Rails.logger.info("Report before save: #{report.attributes.inspect}")

      unless report.save
        Rails.logger.error("Report save failed: #{report.errors.full_messages}")
        errors.merge!(report.errors)
        return nil
      end

      Rails.logger.info("Report after save: #{report.attributes.inspect}")
      report
    end
  end
end
