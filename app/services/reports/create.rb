# frozen_string_literal: true

require 'active_interaction'
require 'open-uri'

class Reports::Create < ActiveInteraction::Base
  hash :data do
    string :title
    string :description
    string :name
    string :gender
    string :species
    string :breed_1
    string :breed_2
    string :color_1
    string :color_2
    string :color_3
    array :image_urls
  end

  def execute
    byebug
    report = Report.new(
      title: data.fetch(:title),
      description: data.fetch(:description),
      name: data.fetch(:name),
      species: data.fetch(:species),
      gender: data.fetch(:gender),
      breed_1: data.fetch(:breed_1),
      breed_2: data.fetch(:breed_2),
      color_1: data.fetch(:color_1),
      color_2: data.fetch(:color_2),
      color_3: data.fetch(:color_3),
      status: 'active',
    )

    report.save ? attach_images(report) : errors.add(:images, 'could not be added')

    report
  end

  private

  def attach_images(report)
    data.fetch(:image_urls).each do |url|
      report.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
    end
  end
end
