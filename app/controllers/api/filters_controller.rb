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
  end
end