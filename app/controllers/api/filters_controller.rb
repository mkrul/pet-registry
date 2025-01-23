module Api
  class FiltersController < ApplicationController
    def states
      country = params[:country]
      states = Report.where(country: country)
                    .where.not(state: [nil, ''])
                    .distinct
                    .pluck(:state)
                    .compact
                    .sort

      render json: { states: states }
    end

    def cities
      country = params[:country]
      state = params[:state]

      cities = Report.where(country: country, state: state)
                    .where.not(area: [nil, ''])
                    .distinct
                    .pluck(:area)
                    .compact
                    .sort

      render json: { cities: cities }
    end

    def breeds
      species = params[:species]&.downcase

      if species.present? && %w[dog cat].include?(species)
        breeds = Report.valid_breeds_for(species)
        render json: { breeds: breeds }
      else
        render json: { breeds: [] }
      end
    end
  end
end