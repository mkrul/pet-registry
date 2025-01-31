module ReportNormalizations
  extend ActiveSupport::Concern

  included do
    normalizes :status,
               :archived_at,
               :name,
               :species,
               :color_1,
               :color_2,
               :color_3,
               :gender,
               :microchip_id,
               with: ->(value) { value.presence&.downcase || nil }

    normalizes :title,
               :description,
               with: ->(value) { value.presence }
  end
end