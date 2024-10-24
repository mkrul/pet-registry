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
  file :image

  def execute
    update_report
    update_image

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
    report.image(&:purge)

    report.image.attach(image)
  end
end