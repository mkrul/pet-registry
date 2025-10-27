module Events
  module Report
    module Update
      extend ActiveSupport::Concern

      CATEGORY = 'report_updated'.freeze

      included do
        validate :validate_update_data, if: -> { category == CATEGORY }
      end

      class_methods do
        def create_report_updated(eventable:, user:)
          create(
            eventable: eventable,
            user: user,
            category: CATEGORY,
            data: {
              title: eventable.title,
              species: eventable.species
            }
          )
        end
      end

      def title
        data['title']
      end

      def species
        data['species']
      end

      private

      def validate_update_data
        if data['title'].blank?
          errors.add(:data, 'title is required for report_updated events')
        end
      end
    end
  end
end
