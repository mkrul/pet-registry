module Api
  class FiltersController < ApplicationController
    def states
      country = params[:country]
      Rails.logger.debug "Fetching states for country: #{country}"

      states = Report.where(country: country)
                    .where.not(state: [nil, ''])
                    .distinct
                    .pluck(:state)
                    .compact
                    .sort

      Rails.logger.debug "Found states: #{states.inspect}"
      render json: { states: states }
    end

    def cities
      country = params[:country]
      state = params[:state]
      Rails.logger.debug "Fetching cities for country: #{country}, state: #{state}"

      cities = Report.where(country: country, state: state)
                    .where.not(city: [nil, ''])
                    .distinct
                    .pluck(:city)
                    .compact
                    .sort

      Rails.logger.debug "Found cities: #{cities.inspect}"
      render json: { cities: cities }
    end

    def breeds
      species = params[:species]&.downcase
      Rails.logger.debug "Fetching breeds for species: #{species}"

      breeds = Report.where(species: species)
                    .where.not(breed_1: [nil, ''])
                    .distinct
                    .pluck(:breed_1)
                    .compact
                    .sort

      Rails.logger.debug "Found breeds: #{breeds.inspect}"
      render json: { breeds: breeds }
    end
  end
end