module Events
  module Report
    module Tip
      extend ActiveSupport::Concern

      CATEGORY = 'report_tip'.freeze

      included do
        validate :validate_tip_data, if: -> { category == CATEGORY }
      end

      class_methods do
        def create_tip(eventable:, user:, message:, area: nil, state: nil, country: nil, latitude: nil, longitude: nil)
          create(
            eventable: eventable,
            user: user,
            category: CATEGORY,
            data: {
              message: message,
              area: area,
              state: state,
              country: country,
              latitude: latitude,
              longitude: longitude
            }.compact
          )
        end
      end

      def message
        data['message']
      end

      def area
        data['area']
      end

      def state
        data['state']
      end

      def country
        data['country']
      end

      def latitude
        data['latitude']
      end

      def longitude
        data['longitude']
      end

      def intersection
        data['intersection']
      end

      def external_links
        data['external_links'] || []
      end

      private

      def validate_tip_data
        if data['message'].blank?
          errors.add(:data, 'message is required for tip events')
        end
      end
    end
  end
end

