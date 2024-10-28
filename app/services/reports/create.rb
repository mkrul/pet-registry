# frozen_string_literal: true

require 'active_interaction'
require 'open-uri'

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
  string :image_url

  def execute
    report = Report.new(
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
      microchip_id: microchip_id,
      status: 'active'
    )

    if report.save
      handle_image(report)
    else
      if report.errors.any?
        puts "Errors while creating #{report.title}: #{report.errors.full_messages.join(', ')}"

        errors.merge!(report.errors)
      end
    end

    report
  end

  private

  def handle_image(report)
    response = CloudinaryService.upload_image(image_url)

    attach_image(report, response)
  end

  def attach_image(report, response)
    filename = File.basename(image_url)

    report.image.attach(
      io: URI.open(response['secure_url']),
      filename: filename.presence || response['public_id'],
      content_type: 'image/jpeg',
      metadata: {
        cloudinary_public_id: response['public_id']
      }
    )
  end
end
