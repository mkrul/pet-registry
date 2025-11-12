# frozen_string_literal: true

require 'active_interaction'
require 'uri'

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
      notify_recipient_of_new_conversation(conversation)

      conversation
    end

    private

    def notify_recipient_of_new_conversation(conversation)
      recipient = conversation.other_participant_for(current_user)
      return unless recipient&.email.present?
      return unless send_conversation_emails?(recipient)

      NotificationMailer.notification_email(
        user: recipient,
        subject: conversation_email_subject(conversation),
        intro: conversation_email_intro,
        body_lines: conversation_email_body_lines(conversation),
        cta_label: "Open conversation",
        cta_url: dashboard_conversation_url(conversation),
        unsubscribe_url: dashboard_settings_url
      ).deliver_later
    end

    def send_conversation_emails?(user)
      settings = user.settings
      return true unless settings.is_a?(Hash)

      value = settings.respond_to?(:stringify_keys) ? settings.stringify_keys['send_email_for_conversation'] : settings['send_email_for_conversation']
      value.nil? ? true : value
    end

    def conversation_email_subject(conversation)
      initiator = display_name_for(current_user)

      if (title = conversation_topic(conversation)).present?
        "#{initiator} started a conversation about #{title}"
      else
        "#{initiator} started a conversation with you"
      end
    end

    def conversation_email_intro
      "#{display_name_for(current_user)} just started a conversation with you on Lost Pets Registry."
    end

    def conversation_email_body_lines(conversation)
      lines = []

      if (title = conversation_topic(conversation)).present?
        lines << %(They're reaching out regarding "#{title}".)
      end

      lines << "Sign in to your dashboard to review the thread and respond."
      lines
    end

    def conversation_topic(conversation)
      messageable = conversation.messageable
      return unless messageable

      if messageable.respond_to?(:title)
        messageable.title
      elsif messageable.respond_to?(:name)
        messageable.name
      end
    end

    def display_name_for(user)
      user.display_name.presence || user.email
    end

    def dashboard_conversation_url(conversation)
      base = Rails.application.routes.url_helpers.root_url
      URI.join(base, "dashboard/messages/#{conversation.id}").to_s
    end

    def dashboard_settings_url
      base = Rails.application.routes.url_helpers.root_url
      URI.join(base, "dashboard/settings").to_s
    end
  end
end


