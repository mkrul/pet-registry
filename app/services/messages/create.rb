# frozen_string_literal: true

require 'active_interaction'

module Messages
  class Create < ActiveInteraction::Base
    record :conversation, class: ::Conversation
    record :user, class: ::User
    string :body

    def execute
      raise ActiveInteraction::InvalidInteractionError, 'Empty message' if body.blank?

      message = conversation.messages.create!(user: user, body: body)

      recipient = (conversation.sender_id == user.id) ? conversation.recipient : conversation.sender

      MessageReadReceipt.create!(message: message, user: recipient, read_at: nil)

      message
    end
  end
end


