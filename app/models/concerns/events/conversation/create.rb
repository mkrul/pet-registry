module Events
  module Conversation
    module Create
      extend ActiveSupport::Concern

      CATEGORY = 'conversation_started'.freeze

      included do
        validate :validate_create_data, if: -> { category == CATEGORY }
      end

      class_methods do
        def create_conversation_started(eventable:, user:)
          create(
            eventable: eventable,
            user: user,
            category: CATEGORY,
            data: {
              recipient_id: eventable.recipient_id,
              messageable_type: eventable.messageable_type,
              messageable_id: eventable.messageable_id
            }
          )
        end
      end

      def recipient_id
        data['recipient_id']
      end

      def messageable_type
        data['messageable_type']
      end

      def messageable_id
        data['messageable_id']
      end

      private

      def validate_create_data
        if data['recipient_id'].blank?
          errors.add(:data, 'recipient_id is required for conversation_started events')
        end
      end
    end
  end
end

