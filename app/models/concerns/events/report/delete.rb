module Events
  module Report
    module Delete
      extend ActiveSupport::Concern

      CATEGORY = 'report_deleted'.freeze

      included do
        validate :validate_delete_data, if: -> { category == CATEGORY }
      end

      class_methods do
        def create_report_deleted(eventable:, user:)
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

      def validate_delete_data
        if data['title'].blank?
          errors.add(:data, 'title is required for report_deleted events')
        end
      end
    end
  end
end

