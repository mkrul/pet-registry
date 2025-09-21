# frozen_string_literal: true

require 'active_interaction'

module Reports
  class CopyFromPet < ActiveInteraction::Base
    record :pet, class: Pet
    hash :report_attributes, strip: false

    validate :pet_has_image

    def execute
      new_report.image.attach(
        io: StringIO.new(pet.image.download),
        filename: pet.image.filename,
        content_type: pet.image.content_type
      )
      if new_report.save
        update_pet
        new_report
      else
        errors.merge!(report.errors)
        nil
      end
    rescue => e
      errors.add(:base, "Failed to copy pet image: #{e.message}")
      nil
    end

    private

    def new_report
      @new_report ||= Report.new(report_attributes.merge(status: 'active'))
    end

    def update_pet
      pet.update(report_id: new_report.id)
    end

    def pet_has_image
      errors.add(:base, "Pet must have an image") unless pet.image.attached?
    end
  end
end
