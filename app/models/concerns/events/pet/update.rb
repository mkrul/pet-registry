module Events
  module Pet
    module Update
      extend ActiveSupport::Concern

      CATEGORY = 'pet_updated'.freeze

      included do
        validate :validate_update_data, if: -> { category == CATEGORY }
      end

      class_methods do
        def create_pet_updated(eventable:, user:)
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

      def validate_update_data
        if data['name'].blank?
          errors.add(:data, 'name is required for pet_updated events')
        end
      end
    end
  end
end
