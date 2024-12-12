# frozen_string_literal: true

require 'active_interaction'

class Reports::Update < ActiveInteraction::Base
  record :report, class: Report
  string :title, default: nil
  string :description, default: nil
  string :name, default: nil
  string :gender, default: nil
  string :species, default: nil
  string :breed_1, default: nil
  string :breed_2, default: nil
  string :color_1, default: nil
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
    ActiveRecord::Base.transaction do
      purge_existing_image if image.present?

      if update_report_attributes
        attach_new_image if image.present?
        report
      else
        errors.merge!(report.errors)
        nil
      end
    end
  end

  private

  def update_report_attributes
    report.update(
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
      longitude: longitude
    )
  end

  def purge_existing_image
    report.image.purge_later if report.image.attached?
  end

  def attach_new_image
    report.image.attach(image)
  end
end
