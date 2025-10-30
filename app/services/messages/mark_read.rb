# frozen_string_literal: true

require 'active_interaction'

module Messages
  class MarkRead < ActiveInteraction::Base
    record :conversation, class: ::Conversation
    record :user, class: ::User

    def execute
      receipts = MessageReadReceipt.joins(:message)
        .where(user_id: user.id, read_at: nil, messages: { conversation_id: conversation.id })
      receipts.update_all(read_at: Time.current)
      true
    end
  end
end


