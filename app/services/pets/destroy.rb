# frozen_string_literal: true

require 'active_interaction'

class Pets::Destroy < ActiveInteraction::Base
  record :pet, class: Pet

  def execute
    pet.soft_delete!
    pet
  end
end
