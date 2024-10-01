# frozen_string_literal: true

require 'active_interaction'
require 'open-uri'

class Reports::Destroy < ActiveInteraction::Base
  record :report

  def execute
    delete_remote_image
    purge_local_images

    report.destroy!
  end

  private

  def delete_remote_image
    report.images.each do |image|
      CloudinaryService.delete_image(image.filename.to_s)
    end
  end

  def purge_local_images
    report.images.purge
  end
end
