# frozen_string_literal: true

module Api
  class EventsController < ApplicationController
    before_action :set_report, only: [:create_tip, :index_tips, :all_tips, :last_location]
    before_action :authenticate_user!, only: [:create_tip, :user_events]
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
            intersection: outcome.result.intersection,
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
      page = (params[:page] || 1).to_i
      per_page = (params[:per_page] || 5).to_i

      tips_query = @report.tips.includes(:user).order(created_at: :desc)
      total_count = tips_query.count
      offset = (page - 1) * per_page
      tips = tips_query.limit(per_page).offset(offset)

      paginated_tips = PaginatedCollection.new(
        tips.to_a,
        total: total_count,
        page: page,
        per_page: per_page
      )

      render json: {
        tips: paginated_tips.map do |tip|
          {
            id: tip.id,
            message: tip.message,
            area: tip.area,
            state: tip.state,
            country: tip.country,
            latitude: tip.latitude,
            longitude: tip.longitude,
            intersection: tip.intersection,
            external_links: tip.external_links,
            created_at: tip.created_at,
            user: {
              id: tip.user.id,
              display_name: tip.user.display_name || tip.user.email
            }
          }
        end,
        pagination: {
          pages: paginated_tips.total_pages,
          count: paginated_tips.total_entries,
          page: paginated_tips.current_page,
          items: paginated_tips.per_page,
          per_page: per_page
        }
      }, status: :ok
    end

    def all_tips
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
            intersection: tip.intersection,
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

    def last_location
      # Find the most recent event with location data
      recent_event = @report.tips
        .where("data->>'latitude' IS NOT NULL AND data->>'longitude' IS NOT NULL")
        .where("data->>'latitude' != '' AND data->>'longitude' != ''")
        .order(created_at: :desc)
        .first

      if recent_event
        render json: {
          latitude: recent_event.latitude,
          longitude: recent_event.longitude,
          area: recent_event.area,
          state: recent_event.state,
          country: recent_event.country,
          intersection: recent_event.intersection,
          source: 'event'
        }, status: :ok
      elsif @report.latitude.present? && @report.longitude.present?
        # Fall back to report location if no events have location data
        render json: {
          latitude: @report.latitude,
          longitude: @report.longitude,
          area: @report.area,
          state: @report.state,
          country: @report.country,
          intersection: @report.intersection,
          source: 'report'
        }, status: :ok
      else
        render json: { message: 'No location data available' }, status: :not_found
      end
    end

    def user_events
      page = (params[:page] || 1).to_i
      per_page = 5

      events_query = current_user.events
        .includes(:eventable)
        .order(created_at: :desc)

      total_count = events_query.count
      offset = (page - 1) * per_page
      events = events_query.limit(per_page).offset(offset)

      paginated_events = PaginatedCollection.new(
        events.to_a,
        total: total_count,
        page: page,
        per_page: per_page
      )

      render json: {
        events: ActiveModelSerializers::SerializableResource.new(
          paginated_events.to_a,
          each_serializer: EventSerializer
        ),
        pagination: {
          pages: paginated_events.total_pages,
          count: paginated_events.total_entries,
          page: paginated_events.current_page,
          items: paginated_events.per_page,
          per_page: per_page
        }
      }, status: :ok
    rescue StandardError => e
      Rails.logger.error "EventsController#user_events: Exception raised: #{e.class} - #{e.message}"
      Rails.logger.error "EventsController#user_events: Backtrace: #{e.backtrace.first(10).join("\n")}"
      render json: {
        error: "Internal server error",
        message: e.message
      }, status: :internal_server_error
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
