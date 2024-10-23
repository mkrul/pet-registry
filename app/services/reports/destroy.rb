# frozen_string_literal: true

require 'active_interaction'

class Reports::Destroy < ActiveInteraction::Base
  record :report
  boolean :delete_seed, default: false

  def execute
    delete_remote_images
    purge_local_images

    report.destroy!
  end

  private

  def delete_remote_images
    report.images.each do |image|
      public_id = image.blob.metadata['cloudinary_public_id']
      next unless public_id

      CloudinaryService.delete_image(public_id)
    end
  end

  def purge_local_images
    report.images.purge
  end
end
