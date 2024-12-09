# frozen_string_literal: true

module Api
  class ReportsController < ApplicationController
    include Pagy::Backend

    before_action :set_report, only: %i[show edit update destroy]
    skip_before_action :verify_authenticity_token

    def index
      outcome = Reports::Fetch.run(index_params)

      if outcome.valid?
        search_results = outcome.result
        reports = Report.includes(image_attachment: :blob)
                       .where(id: search_results.hits.map { |hit| hit["_id"] })
                       .index_by(&:id)
                       .values_at(*search_results.hits.map { |hit| hit["_id"].to_i })
                       .compact

        pagination = {
          count: search_results.total_count,
          items: search_results.per_page,
          pages: (search_results.total_count.to_f / search_results.per_page).ceil,
          page: search_results.current_page
        }

        serialized_reports = ActiveModelSerializers::SerializableResource.new(reports, each_serializer: ReportSerializer).as_json
        render json: { data: serialized_reports, pagination: pagination }, status: :ok
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

    def index_params
      params.permit(:query, :page, :per_page, :species, :color, :gender, :sort)
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
        :image
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
        :image
      ).merge(report: @report)
    end

  end
end
