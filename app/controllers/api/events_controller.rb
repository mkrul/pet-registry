# frozen_string_literal: true

module Api
  class EventsController < ApplicationController
    before_action :set_report, only: [:create_tip, :index_tips]
    before_action :authenticate_user!, only: [:create_tip]
    skip_before_action :verify_authenticity_token

    def create_tip
      outcome = Events::Create.run(
        eventable: @report,
        user: current_user,
        category: Events::Report::Tip::CATEGORY,
        data: tip_params
      )

      if outcome.valid?
        render json: {
          message: "Tip submitted successfully",
          tip: {
            id: outcome.result.id,
            message: outcome.result.message,
            area: outcome.result.area,
            state: outcome.result.state,
            country: outcome.result.country,
            latitude: outcome.result.latitude,
            longitude: outcome.result.longitude,
            external_links: outcome.result.external_links,
            created_at: outcome.result.created_at,
            user: {
              id: current_user.id,
              display_name: current_user.display_name || current_user.email
            }
          }
        }, status: :created
      else
        render json: {
          errors: outcome.errors.full_messages,
          message: outcome.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
      end
    end

    def index_tips
      tips = @report.tips.includes(:user).order(created_at: :desc)

      render json: {
        tips: tips.map do |tip|
          {
            id: tip.id,
            message: tip.message,
            area: tip.area,
            state: tip.state,
            country: tip.country,
            latitude: tip.latitude,
            longitude: tip.longitude,
            external_links: tip.external_links,
            created_at: tip.created_at,
            user: {
              id: tip.user.id,
              display_name: tip.user.display_name || tip.user.email
            }
          }
        end
      }, status: :ok
    end

    private

    def set_report
      @report = Report.find(params[:report_id])
    end

    def tip_params
      params.permit(:message, :area, :state, :country, :latitude, :longitude, external_links: [])
    end
  end
end
