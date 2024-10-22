# frozen_string_literal: true

require 'active_interaction'
require 'open-uri'

class Reports::Update < ActiveInteraction::Base
  record :report, class: Report
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
  array :image_ids_to_keep, default: []
  array :images, default: [] do
    file
  end

  def execute
    update_report
    update_images

    report
  end

  private

  def update_report
    report.update(
      title: title,
      description: description,
      name: name,
      species: species,
      gender: gender,
      breed_1: breed_1,
      breed_2: breed_2,
      color_1: color_1,
      color_2: color_2,
      color_3: color_3,
      microchipped: microchipped,
      microchip_id: microchip_id
    )
  end

  def update_images
    # Remove images not in the list of IDs to keep
    images_to_remove = report.images.where.not(id: image_ids_to_keep)
    images_to_remove.each(&:purge)

    # Attach new images
    images.each do |image|
      report.images.attach(image)
    end
  end
end