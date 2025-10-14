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
    Rails.logger.info("=" * 80)
    Rails.logger.info("Pets::Create service execute method")
    Rails.logger.info("Input keys: #{inputs.keys}")
    Rails.logger.info("Inputs: #{inputs.inspect}")
    Rails.logger.info("Image present?: #{inputs[:image].present?}")
    Rails.logger.info("Image class: #{inputs[:image].class}") if inputs[:is_altered].present?
    Rails.logger.info("is_altered value: #{inputs[:is_altered].inspect}")
    Rails.logger.info("is_altered class: #{inputs[:is_altered].class}")

    processed_inputs = inputs.to_h.dup
    processed_inputs[:is_altered] = case inputs[:is_altered]
                                   when 'true', '1', 1, true then true
                                   when 'false', '0', 0, false then false
                                   else nil
                                   end

    Rails.logger.info("Processed is_altered: #{processed_inputs[:is_altered].inspect}")
    Rails.logger.info("Creating Pet with processed_inputs: #{processed_inputs.inspect}")

    pet = Pet.new(processed_inputs)
    Rails.logger.info("Pet instantiated")
    Rails.logger.info("Pet attributes before save: #{pet.attributes.inspect}")
    Rails.logger.info("Pet valid?: #{pet.valid?}")

    unless pet.valid?
      Rails.logger.error("Pet validation failed before save:")
      pet.errors.full_messages.each do |msg|
        Rails.logger.error("  - #{msg}")
      end
    end

    unless pet.save
      Rails.logger.error("=" * 80)
      Rails.logger.error("Pet save failed!")
      Rails.logger.error("Errors: #{pet.errors.full_messages}")
      Rails.logger.error("Error details: #{pet.errors.details}")
      Rails.logger.error("=" * 80)
      errors.merge!(pet.errors)
      return nil
    end

    Rails.logger.info("Pet saved successfully!")
    Rails.logger.info("Pet after save: #{pet.attributes.inspect}")
    Rails.logger.info("=" * 80)
    pet
  rescue StandardError => e
    Rails.logger.error("=" * 80)
    Rails.logger.error("Unexpected error in Pets::Create:")
    Rails.logger.error("Error class: #{e.class}")
    Rails.logger.error("Error message: #{e.message}")
    Rails.logger.error("Backtrace: #{e.backtrace.join("\n")}")
    Rails.logger.error("=" * 80)
    raise
  end
  end
end
