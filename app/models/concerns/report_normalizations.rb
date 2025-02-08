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
               :altered,
               with: ->(value) { value.presence }

    normalizes :title,
               :gender,
               :name,
               :color_2,
               :color_3,
               :breed_2,
               with: ->(value) { value.presence }
  end
end