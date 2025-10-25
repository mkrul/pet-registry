# frozen_string_literal: true

module Api
  class EventsController < ApplicationController
    before_action :set_report, only: [:create_tip, :index_tips]
    before_action :authenticate_user!, only: [:create_tip]
    skip_before_action :verify_authenticity_token

    def create_tip
      Rails.logger.info "EventsController#create_tip: Received params: #{params.inspect}"
      Rails.logger.info "EventsController#create_tip: Permitted params: #{tip_params.inspect}"
      Rails.logger.info "EventsController#create_tip: Report ID: #{@report.id}, User ID: #{current_user.id}"

      outcome = Events::Create.run(
        eventable: @report,
        user: current_user,
        category: Events::Report::Tip::CATEGORY,
        data: tip_params
      )

      if outcome.valid?
        Rails.logger.info "EventsController#create_tip: Tip created successfully with ID: #{outcome.result.id}"
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
        Rails.logger.error "EventsController#create_tip: Validation failed: #{outcome.errors.full_messages.join(', ')}"
        Rails.logger.error "EventsController#create_tip: Errors object: #{outcome.errors.inspect}"
        render json: {
          errors: outcome.errors.full_messages,
          message: outcome.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
      end
    rescue StandardError => e
      Rails.logger.error "EventsController#create_tip: Exception raised: #{e.class} - #{e.message}"
      Rails.logger.error "EventsController#create_tip: Backtrace: #{e.backtrace.first(10).join("\n")}"
      render json: {
        error: "Internal server error",
        message: e.message
      }, status: :internal_server_error
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
      params.permit(:message, :area, :state, :country, :latitude, :longitude, :intersection, external_links: [])
    end
  end
end
