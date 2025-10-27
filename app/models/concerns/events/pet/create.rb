module Events
  module Pet
    module Create
      extend ActiveSupport::Concern

      CATEGORY = 'pet_created'.freeze

      included do
        validate :validate_create_data, if: -> { category == CATEGORY }
      end

      class_methods do
        def create_pet_created(eventable:, user:)
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

      def validate_create_data
        if data['name'].blank?
          errors.add(:data, 'name is required for pet_created events')
        end
      end
    end
  end
end
