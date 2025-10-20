# frozen_string_literal: true

require 'active_interaction'

class Pets::Update < ActiveInteraction::Base
  record :pet, class: Pet
  string :name, default: nil
  string :species, default: nil
  string :breed_1, default: nil
  string :breed_2, default: nil
  string :color_1, default: nil
  string :color_2, default: nil
  string :color_3, default: nil
  string :gender, default: nil
  string :microchip_id, default: nil
  file :image, default: nil
  boolean :is_altered, default: nil

  def execute
    ActiveRecord::Base.transaction do
      purge_existing_image if image.present?

      if update_pet_attributes
        attach_new_image if image.present?
        update_associated_report if pet.report.present?
        pet
      else
        errors.merge!(pet.errors)
        nil
      end
    end
  end

  private

  def update_pet_attributes
    pet.update(
      name: name,
      species: species&.downcase,
      breed_1: breed_1,
      breed_2: breed_2,
      color_1: color_1&.downcase,
      color_2: color_2&.downcase,
      color_3: color_3&.downcase,
      gender: gender,
      microchip_id: microchip_id,
      is_altered: is_altered
    )
  end

  def update_associated_report
    report = pet.report
    return unless report

    report.update(
      name: name || report.name,
      species: species&.downcase || report.species,
      breed_1: breed_1 || report.breed_1,
      breed_2: breed_2 || report.breed_2,
      color_1: color_1&.downcase || report.color_1,
      color_2: color_2&.downcase || report.color_2,
      color_3: color_3&.downcase || report.color_3,
      gender: gender || report.gender,
      microchip_id: microchip_id || report.microchip_id,
      is_altered: is_altered.nil? ? report.is_altered : is_altered
    )
  end

  def purge_existing_image
    pet.image.purge_later if pet.image.attached?
  end

  def attach_new_image
    pet.image.attach(image)
  end
end
