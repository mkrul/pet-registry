# frozen_string_literal: true

require 'active_interaction'

class Reports::Destroy < ActiveInteraction::Base
  record :report

  def execute
    ActiveRecord::Base.transaction do
      purge_attached_image
      report.destroy!
    end
  end

  private

  def purge_attached_image
    report.image.purge_later if report.image.attached?
  end
end
