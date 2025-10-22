# frozen_string_literal: true

require 'active_interaction'

module Events
  class Create < ActiveInteraction::Base
    object :eventable
    object :user
    string :category
    hash :data, strip: false, default: {}

    validates :category, presence: true
    validates :data, presence: true

    def execute
      event = Event.new(
        eventable: eventable,
        user: user,
        category: category,
        data: data
      )

      unless event.save
        errors.merge!(event.errors)
        return nil
      end

      event
    end
  end
end

