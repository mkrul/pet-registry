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

    def execute
      Rails.logger.info("Create pet service inputs: #{inputs.inspect}")

      processed_inputs = inputs.to_h.dup
      processed_inputs[:is_altered] = case inputs[:is_altered]
                                     when 'true', '1', 1, true then true
                                     when 'false', '0', 0, false then false
                                     else nil
                                     end

      pet = Pet.new(processed_inputs)
      Rails.logger.info("Pet before save: #{pet.attributes.inspect}")

      unless pet.save
        Rails.logger.error("Pet save failed: #{pet.errors.full_messages}")
        errors.merge!(pet.errors)
        return nil
      end

      Rails.logger.info("Pet after save: #{pet.attributes.inspect}")
      pet
    end
  end
end
