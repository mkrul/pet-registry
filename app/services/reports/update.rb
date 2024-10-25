# frozen_string_literal: true

require 'active_interaction'
require 'open-uri'

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

  def execute
    update_image if image.present?
    update_report

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

  def update_image
    report.image.purge if report.image.attached?

    report.image.attach(image)

    if report.image.attached?
      cloudinary_response = CloudinaryService.upload_image(image.tempfile.path)
      report.image.blob.update(
        metadata: {
          cloudinary_public_id: cloudinary_response['public_id']
        }
      )
    end
  end
end