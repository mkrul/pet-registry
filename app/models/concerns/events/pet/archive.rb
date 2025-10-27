module Events
  module Pet
    module Archive
      extend ActiveSupport::Concern

      CATEGORY = 'pet_archived'.freeze

      included do
        validate :validate_archive_data, if: -> { category == CATEGORY }
      end

      class_methods do
        def create_pet_archived(eventable:, user:)
          create(
            eventable: eventable,
            user: user,
            category: CATEGORY,
            data: {
              name: eventable.name,
              species: eventable.species
            }
          )
        end
      end

      def name
        data['name']
      end

      def species
        data['species']
      end

      private

      def validate_archive_data
        if data['name'].blank?
          errors.add(:data, 'name is required for pet_archived events')
        end
      end
    end
  end
end
