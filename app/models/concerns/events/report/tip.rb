module Events
  module Report
    module Tip
      extend ActiveSupport::Concern

      CATEGORY = 'report_tip'.freeze

      included do
        validate :validate_tip_data, if: -> { category == CATEGORY }
        before_save :normalize_tip_location_data, if: -> { category == CATEGORY }
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

      def normalize_tip_location_data
        return unless data.is_a?(Hash)

        normalized_data = data.dup

        normalized_data['area'] = normalized_data['area'].to_s.strip.presence if normalized_data['area'].present?
        normalized_data['state'] = normalized_data['state'].to_s.strip.presence if normalized_data['state'].present?
        normalized_data['country'] = normalized_data['country'].to_s.strip.presence if normalized_data['country'].present?
        normalized_data['intersection'] = normalized_data['intersection'].to_s.strip.presence if normalized_data['intersection'].present?
        normalized_data['message'] = normalized_data['message'].to_s.strip.presence if normalized_data['message'].present?

        if normalized_data['latitude'].present?
          normalized_data['latitude'] = normalized_data['latitude'].to_s.strip.presence
        end

        if normalized_data['longitude'].present?
          normalized_data['longitude'] = normalized_data['longitude'].to_s.strip.presence
        end

        self.data = normalized_data
      end

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

