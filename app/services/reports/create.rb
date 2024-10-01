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

    report.save ? attach_images(report) : errors.add(:images, 'could not be added')

    report
  end

  private

  def attach_images(report)
    image_urls.each do |url|
      if local_file?(url)
        attach_local_image(report, url)
      else
        attach_remote_image(report, url)
      end
    end
  end

  def local_file?(url)
    File.exist?(Rails.root.join('lib', 'assets', 'reports', File.basename(url)))
  end

  def attach_local_image(report, path)
    local_path = Rails.root.join('lib', 'assets', 'reports', File.basename(path))
    report.images.attach(io: File.open(local_path), filename: File.basename(local_path), content_type: 'image/jpeg')
  end

  def attach_remote_image(report, url)
    report.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
end
