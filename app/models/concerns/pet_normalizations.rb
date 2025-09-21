module PetNormalizations
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
    normalizes :name, with: ->(value) { value.presence }
  end
end
