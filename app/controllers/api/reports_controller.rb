# frozen_string_literal: true

module Api
  class ReportsController < ApplicationController
    include Pagy::Backend

    before_action :set_report, only: %i[show edit update destroy]
    skip_before_action :verify_authenticity_token

    def index
      outcome = Reports::Fetch.run(report_index_params)

      if outcome.valid?
        pagy, reports = pagy(outcome.result, items: report_index_params[:per_page] || Report::REPORT_PAGE_LIMIT, page: report_index_params[:page])
        serialized_reports = ActiveModelSerializers::SerializableResource.new(reports, each_serializer: ReportSerializer).as_json

        render json: { data: serialized_reports, pagination: pagy_metadata(pagy) }, status: :ok
      else
        render json: { errors: outcome.errors.full_messages }, status: :unprocessable_entity
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
      outcome = Reports::Create.run(report_creation_params)

      if outcome.valid?
        serialized_report = ReportSerializer.new(outcome.result).as_json
        render json: serialized_report, status: :created
      else
        render json: { errors: outcome.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      debugger
      outcome = Reports::Update.run(report_update_params)

      if outcome.valid?
        serialized_report = ReportSerializer.new(outcome.result).as_json
        render json: serialized_report, status: :ok
      else
        render json: { errors: @report.errors.full_messages }, status: :unprocessable_entity
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

    def report_index_params
      params.permit(:query, :page, :per_page)
    end

    def report_create_params
      params.require(:data).permit(
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
        image_urls: []
      )
    end

    def report_update_params
      permitted_params = params.permit(
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
      )

      if params[:image_urls].present?
        permitted_params.merge!(image_urls: params[:image_urls])
      end

      permitted_params.merge(report: @report)
    end

    def image_params
      params.require(:data).permit(image_urls: [])
    end
  end
end
