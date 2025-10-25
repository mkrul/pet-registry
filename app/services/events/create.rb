# frozen_string_literal: true

require 'active_interaction'

module Events
  class Create < ActiveInteraction::Base
    object :user
    string :category
    hash :data, strip: false, default: {}

    validates :category, presence: true
    validates :data, presence: true

    def initialize(options = {})
      @eventable = options.delete(:eventable)
      super(options)
    end

    attr_accessor :eventable

    def execute
      Rails.logger.info "Events::Create#execute: Creating event with eventable class: #{eventable.class}, category: #{category}"

      event = Event.new(
        eventable: eventable,
        user: user,
        category: category,
        data: data
      )

      Rails.logger.info "Events::Create#execute: Event object built: #{event.inspect}"

      unless event.save
        Rails.logger.error "Events::Create#execute: Event save failed: #{event.errors.full_messages.join(', ')}"
        errors.merge!(event.errors)
        return nil
      end

      Rails.logger.info "Events::Create#execute: Event saved successfully with ID: #{event.id}"
      event
    end

  end
end

