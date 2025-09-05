# frozen_string_literal: true

module Api
  class ReportsController < ApplicationController

    before_action :set_report, only: %i[show edit update destroy]
    skip_before_action :verify_authenticity_token

    def index
      page = (params[:page] || 1).to_i
      per_page = (params[:per_page] || Report::REPORT_INDEX_PAGE_LIMIT).to_i

      result = Reports::Search.run(
        query: params[:query],
        species: params[:species],
        color: params[:color],
        gender: params[:gender],
        country: params[:country],
        state: params[:state],
        area: params[:area],
        intersection: params[:intersection],
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
          },
          message: reports.empty? ? "No reports found matching your search criteria." : nil
        }
      else
        render json: { errors: result.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def new
      @report = Report.new
      render json: {
        report: {
          title: "",
          description: "",
          name: "",
          gender: "",
          species: "",
          breed_1: "",
          breed_2: "",
          color_1: "",
          color_2: "",
          color_3: "",
          microchip_id: "",
          area: "",
          state: "",
          country: "",
          latitude: nil,
          longitude: nil,
          intersection: ""
        }
      }, status: :ok
    rescue StandardError => e
      render json: { error: "Failed to initialize new report", details: e.message }, status: :internal_server_error
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
        render json: serialized_report.merge(
          message: "Report created successfully"
        ), status: :created
      else
        render json: {
          errors: outcome.errors.full_messages,
          message: outcome.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
      end
    end

    def update
      outcome = Reports::Update.run(update_params)

      if outcome.valid?
        serialized_report = ReportSerializer.new(outcome.result).as_json
        render json: serialized_report.merge(
          message: "Report updated successfully"
        ), status: :ok
      else
        render json: {
          errors: outcome.errors.full_messages,
          message: outcome.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
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
        :area,
        :sort
      )
    end

    private

    def create_params
      processed_params = params.permit(
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
        :microchip_id,
        :image,
        :area,
        :state,
        :country,
        :latitude,
        :longitude,
        :intersection,
        :altered
      ).merge(report: @report)
    end

    def update_params
      processed_params = params.permit(
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
        :microchip_id,
        :image,
        :area,
        :state,
        :country,
        :latitude,
        :longitude,
        :status,
        :intersection,
        :altered
      ).merge(report: @report)
    end

    def report_params
      params.permit(
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
        :microchip_id,
        :area,
        :state,
        :country,
        :latitude,
        :longitude,
        :intersection,
        :image,
        :altered
      )
    end

  end
end
