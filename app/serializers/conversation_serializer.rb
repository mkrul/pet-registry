# frozen_string_literal: true

class ConversationSerializer < ActiveModel::Serializer
  attributes :id, :other_user, :last_message, :unread_count, :messageable

  def other_user
    current = scope[:current_user]
    user = object.other_participant_for(current)
    { id: user.id, display_name: user.display_name || user.email }
  end

  def last_message
    msg = object.messages.order(created_at: :desc).first
    return nil unless msg
    {
      id: msg.id,
      body: msg.body.truncate(140),
      created_at: msg.created_at
    }
  end

  def unread_count
    MessageReadReceipt.joins(:message)
      .where(user_id: scope[:current_user].id, messages: { conversation_id: object.id }, read_at: nil)
      .count
  end

  def messageable
    return nil unless object.messageable_type && object.messageable_id
    { type: object.messageable_type, id: object.messageable_id }
  end
end


