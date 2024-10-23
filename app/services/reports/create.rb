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
  array :image_urls
  boolean :create_seed, default: false

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
      create_seed ? handle_images_for_seeding(report) : handle_images(report)
      process_image_variants(report)
    else
      errors.merge!(report.errors)
    end

    report
  end

  private

  def handle_images(report)
    image_urls.each do |url|
      # Upload image to Cloudinary in the 'petregistry/reports' folder
      response = CloudinaryService.upload_image(url, folder: 'petregistry/reports')

      attach_image(report, response)
    end
  end

  def handle_images_for_seeding(report)
    image_urls.each do |url|
      local_path = Rails.root.join('lib', 'assets', 'reports', File.basename(url))
      next unless File.exist?(local_path)

      # Upload image to Cloudinary
      response = CloudinaryService.upload_image(local_path, folder: 'petregistry/reports/seeds')

      attach_image(report, response)
    end
  end

  def attach_image(report, response)
    report.images.attach(
      io: URI.open(response['secure_url']),
      filename: response['public_id'],
      content_type: 'image/jpeg',
      metadata: { cloudinary_public_id: response['public_id'] }
    )
  end

  def process_image_variants(report)
    report.images.each do |image|
      report.thumbnail_image(image)
      report.medium_image(image)
    end
  end
end
