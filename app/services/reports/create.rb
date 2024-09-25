# frozen_string_literal: true

require 'active_interaction'

class Reports::Create < ActiveInteraction::Base
  hash :data do
    string :title
    string :description
    string :name
    string :gender
    string :species
    string :breed_1
    string :breed_2, default: nil
    string :color_1
    string :color_2, default: nil
    string :color_3, default: nil
    string :image_urls, default: nil
  end

  def execute
    binding.remote_pry
    report = Report.new(
      title: data[:title],
      description: data[:description],
      name: data[:name],
      species: data[:species],
      gender: data[:gender],
      breed_1: data[:breed_1],
      breed_2: data[:breed_2],
      color_1: data[:color_1],
      color_2: data[:color_2],
      color_3: data[:color_3],
      status: 'active',
    )

    report.save ? attach_images(report) : errors.add(:images, 'could not be added')

    report
  end

  private

  def attach_images(report)
    image_urls.each do |url|
      report.images.attach(io: URI.open(url), filename: File.basename(URI.parse(url).path))
    end
  end
end
