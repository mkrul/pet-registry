# frozen_string_literal: true

require 'active_interaction'

class Reports::Create < ActiveInteraction::Base
  string :title
  string :description
  string :name, default: nil
  string :gender
  string :species
  string :breed_1
  string :breed_2, default: nil
  string :color_1
  string :color_2, default: nil
  string :color_3, default: nil
  boolean :microchipped, default: nil
  string :microchip_id, default: nil
  file :image, default: nil
  string :city, default: nil
  string :state, default: nil
  string :country, default: nil
  float :latitude, default: nil
  float :longitude, default: nil

  def execute
    report = Report.new(
      title: title,
      description: description,
      name: name,
      species: species&.downcase,
      gender: gender,
      breed_1: breed_1,
      breed_2: breed_2,
      color_1: color_1&.downcase,
      color_2: color_2&.downcase,
      color_3: color_3&.downcase,
      microchipped: microchipped,
      microchip_id: microchip_id,
      city: city,
      state: state,
      country: country,
      latitude: latitude,
      longitude: longitude,
      status: 'active'
    )

    ActiveRecord::Base.transaction do
      if report.save
        attach_image(report) if image.present?
        report
      else
        errors.merge!(report.errors)
        nil
      end
    end
  end

  private

  def attach_image(report)
    report.image.attach(image)
  rescue => e
    debugger
    errors.add(:image, "Failed to attach image: #{e.message}")
  end
end
