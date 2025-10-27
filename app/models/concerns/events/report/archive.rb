module Events
  module Report
    module Archive
      extend ActiveSupport::Concern

      CATEGORY = 'report_archived'.freeze

      included do
        validate :validate_archive_data, if: -> { category == CATEGORY }
      end

      class_methods do
        def create_report_archived(eventable:, user:)
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

      def validate_archive_data
        if data['title'].blank?
          errors.add(:data, 'title is required for report_archived events')
        end
      end
    end
  end
end
