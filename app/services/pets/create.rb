# frozen_string_literal: true

require 'active_interaction'

module Pets
  class Create < ActiveInteraction::Base
    string :name
    string :species
    string :breed_1
    string :color_1
    integer :user_id
    string :breed_2, default: nil
    string :color_2, default: nil
    string :color_3, default: nil
    string :gender, default: nil
    string :microchip_id, default: nil
    file :image, default: nil
    boolean :is_altered, default: nil
    string :status, default: Pet::STATUS_HOME

  def execute
    processed_inputs = inputs.to_h.dup
    processed_inputs[:is_altered] = case inputs[:is_altered]
                                   when 'true', '1', 1, true then true
                                   when 'false', '0', 0, false then false
                                   else nil
                                   end

    pet = Pet.new(processed_inputs)

    unless pet.save
      errors.merge!(pet.errors)
      return nil
    end

    pet
  rescue StandardError => e
    raise
  end
  end
end
