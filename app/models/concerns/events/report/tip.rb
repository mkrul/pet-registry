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

        has_location_data = data['area'].present? || data['country'].present? ||
                           data['latitude'].present? || data['longitude'].present?

        if has_location_data
          if data['area'].blank?
            errors.add(:data, 'area is required')
          end

          if data['country'].blank?
            errors.add(:data, 'country is required')
          end

          if data['latitude'].blank?
            errors.add(:data, 'latitude is required')
          end

          if data['longitude'].blank?
            errors.add(:data, 'longitude is required')
          end

          if data['area'].present? && data['area'].downcase != 'washington' && data['state'].blank?
            errors.add(:data, 'state is required')
          end

          if data['country'].present? && data['country'] != 'United States'
            errors.add(:data, 'country must be United States')
          end

          if data['intersection'].present? && data['intersection'].length > 100
            errors.add(:data, 'intersection must be 100 characters or less')
          end
        end
      end
    end
  end
end

