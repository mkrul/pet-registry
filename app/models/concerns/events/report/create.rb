module Events
  module Report
    module Create
      extend ActiveSupport::Concern

      CATEGORY = 'report_created'.freeze

      included do
        validate :validate_create_data, if: -> { category == CATEGORY }
      end

      class_methods do
        def create_report_created(eventable:, user:)
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

      def validate_create_data
        if data['title'].blank?
          errors.add(:data, 'title is required for report_created events')
        end
      end
    end
  end
end
