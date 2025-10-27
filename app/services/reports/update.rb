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
  string :microchip_id, default: nil
  file :image, default: nil
  string :area, default: nil
  string :state, default: nil
  string :country, default: nil
  float :latitude, default: nil
  float :longitude, default: nil
  string :intersection, default: nil
  boolean :is_altered, default: nil
  string :status, default: nil

  def execute
    ActiveRecord::Base.transaction do
      purge_existing_image if image.present?

      if update_report_attributes
        attach_new_image if image.present?
        update_associated_pet if report.pet.present?
        Event.create_report_updated(eventable: report, user: report.user)
        report
      else
        errors.merge!(report.errors)
        nil
      end
    end
  end

  private

  def update_report_attributes
    # Apply privacy offset to coordinates if they're being updated
    processed_latitude = latitude
    processed_longitude = longitude

    if latitude && longitude
      offset_coords = apply_privacy_offset(latitude.to_f, longitude.to_f)
      processed_latitude = offset_coords[:latitude]
      processed_longitude = offset_coords[:longitude]
    end

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
      microchip_id: microchip_id,
      area: area,
      state: state,
      country: country,
      latitude: processed_latitude,
      longitude: processed_longitude,
      intersection: intersection,
      is_altered: is_altered,
      status: status
    )
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

  def update_associated_pet
    pet = report.pet
    return unless pet

    pet.update(
      name: name || pet.name,
      species: species&.downcase || pet.species,
      breed_1: breed_1 || pet.breed_1,
      breed_2: breed_2 || pet.breed_2,
      color_1: color_1&.downcase || pet.color_1,
      color_2: color_2&.downcase || pet.color_2,
      color_3: color_3&.downcase || pet.color_3,
      gender: gender || pet.gender,
      microchip_id: microchip_id || pet.microchip_id,
      is_altered: is_altered.nil? ? pet.is_altered : is_altered
    )
  end

  def purge_existing_image
    report.image.purge_later if report.image.attached?
  end

  def attach_new_image
    report.image.attach(image)
  end
end
