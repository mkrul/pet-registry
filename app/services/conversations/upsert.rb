# frozen_string_literal: true

require 'active_interaction'

module Conversations
  class Upsert < ActiveInteraction::Base
    record :current_user, class: ::User
    integer :recipient_id
    string :messageable_type, default: nil
    integer :messageable_id, default: nil

    def execute
      other_id = recipient_id
      raise ActiveInteraction::InvalidInteractionError, 'Cannot message yourself' if other_id == current_user.id

      ordered = [current_user.id, other_id].sort
      sender_id, recipient_id_canon = ordered[0], ordered[1]

      scope = ::Conversation.where(
        sender_id: sender_id,
        recipient_id: recipient_id_canon,
        messageable_type: messageable_type,
        messageable_id: messageable_id
      )

      conversation = scope.first
      return conversation if conversation

      conversation = ::Conversation.create!(
        sender_id: sender_id,
        recipient_id: recipient_id_canon,
        messageable_type: messageable_type,
        messageable_id: messageable_id
      )

      Event.create_conversation_started(eventable: conversation, user: current_user)

      conversation
    end
  end
end


