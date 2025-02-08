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
               with: ->(value) { value.presence&.downcase }

    normalizes :title,
               :gender,
               :name,
               :color_2,
               :color_3,
               :breed_2,
               with: ->(value) { value.presence }
  end
end