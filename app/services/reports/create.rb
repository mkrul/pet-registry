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
      debugger
      Rails.logger.info("Create service inputs: #{inputs.inspect}")
      report = Report.new(inputs.merge(status: 'active'))
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
