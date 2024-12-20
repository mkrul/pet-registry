# frozen_string_literal: true

module Api
  class ReportsController < ApplicationController
    include Pagy::Backend

    before_action :set_report, only: %i[show edit update destroy]
    skip_before_action :verify_authenticity_token

    def index
      page = (params[:page] || 1).to_i
      per_page = (params[:per_page] || Report::REPORT_PAGE_LIMIT).to_i
      Rails.logger.info("[ReportsController] Received parameters: #{params.inspect}")

      result = Reports::Search.run(
        query: params[:query],
        species: params[:species],
        color: params[:color],
        gender: params[:gender],
        country: params[:country],
        state: params[:state],
        city: params[:city],
        breed: params[:breed],
        sort: params[:sort],
        page: page,
        per_page: per_page
      )

      if result.valid?
        reports = result.result
        render json: {
          data: ActiveModelSerializers::SerializableResource.new(reports),
          pagination: {
            pages: reports.total_pages,
            count: reports.total_entries,
            page: reports.current_page,
            items: reports.per_page
          }
        }
      else
        render json: { errors: result.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def new
      @report = Report.new
      serialized_report = ReportSerializer.new(@report).as_json

      render json: serialized_report, status: :ok
    end

    def show
      serialized_report = ReportSerializer.new(@report).as_json

      render json: serialized_report, status: :ok
    end

    def edit; end

    def create
      outcome = Reports::Create.run(create_params)

      if outcome.valid?
        serialized_report = ReportSerializer.new(outcome.result).as_json
        render json: serialized_report, status: :created
      else
        render json: { errors: outcome.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      outcome = Reports::Update.run(update_params)

      if outcome.valid?
        serialized_report = ReportSerializer.new(outcome.result).as_json
        render json: serialized_report, status: :ok
      else
        Rails.logger.debug "Update failed with errors: #{outcome.errors.full_messages}"
        render json: { errors: outcome.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @report.destroy!

      head :no_content
    end

    private

    def set_report
      @report = Report.find(params[:id])
    end

    def index_params
      params.permit(
        :page,
        :per_page,
        :query,
        :species,
        :color,
        :gender,
        :country,
        :state,
        :city,
        :sort
      )
    end

    private

    def create_params
      params.permit(
        :title,
        :name,
        :description,
        :gender,
        :species,
        :breed_1,
        :breed_2,
        :color_1,
        :color_2,
        :color_3,
        :microchipped,
        :microchip_id,
        :image,
        :city,
        :state,
        :country,
        :latitude,
        :longitude
      ).merge(report: @report)
    end

    def update_params
      params.permit(
        :id,
        :title,
        :description,
        :name,
        :gender,
        :species,
        :breed_1,
        :breed_2,
        :color_1,
        :color_2,
        :color_3,
        :microchipped,
        :microchip_id,
        :image,
        :city,
        :state,
        :country,
        :latitude,
        :longitude,
        :status
      ).merge(report: @report)
    end

  end
end
