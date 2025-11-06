module ReportNormalizations
  extend ActiveSupport::Concern

  included do
    normalizes :gender, with: ->(value) { value.downcase.presence }
    normalizes :species, with: ->(value) { value.downcase.presence }
    normalizes :breed_1, with: ->(value) { value.presence }
    normalizes :breed_2, with: ->(value) { value.presence }
    normalizes :color_1, with: ->(value) { value.downcase.presence }
    normalizes :color_2, with: ->(value) { value.downcase.presence }
    normalizes :color_3, with: ->(value) { value.downcase.presence }
    normalizes :microchip_id, with: ->(value) { value.presence }
    normalizes :title, with: ->(value) { value.presence }
    normalizes :description, with: ->(value) { value.presence }
    normalizes :name, with: ->(value) { value.presence }
    normalizes :is_altered, with: ->(value) { value.presence }
    normalizes :status, with: ->(value) { value.presence }
    normalizes :created_at, with: ->(value) { value.presence }
    normalizes :updated_at, with: ->(value) { value.presence }
    normalizes :archived_at, with: ->(value) { value.presence }
  end
end