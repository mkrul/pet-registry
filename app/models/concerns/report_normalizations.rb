module ReportNormalizations
  extend ActiveSupport::Concern

  included do
    normalizes :status,
               :archived_at,
               :species,
               :color_1,
               :color_2,
               :color_3,
               :gender,
               :microchip_id,
               with: ->(value) { value.presence&.downcase || nil }

    normalizes :title,
               :description,
               :name,
               with: ->(value) { value.presence }
  end
end