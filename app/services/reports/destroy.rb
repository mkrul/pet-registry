# frozen_string_literal: true

require 'active_interaction'

class Reports::Destroy < ActiveInteraction::Base
  record :report

  def execute
    delete_remote_image
    purge_local_image

    report.destroy!
  end

  private

  def delete_remote_image
    return unless report.image.attached? && report.image.blob.metadata['cloudinary_public_id']

    public_id = report.image.blob.metadata['cloudinary_public_id']

    CloudinaryService.delete_image(public_id)
  end

  def purge_local_image
    return unless report.image.attached?

    report.image.purge
  end
end
