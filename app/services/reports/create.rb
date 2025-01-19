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

    def execute
      report = Report.new(inputs.merge(status: 'active'))

      unless report.save
        errors.merge!(report.errors)
        return nil
      end

      report
    end
  end
end
