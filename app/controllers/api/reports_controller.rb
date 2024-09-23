# require 'pagy/extras/metadata'

module Api
  class ReportsController < ApplicationController
    before_action :set_report, only: %i[show edit update destroy]
    skip_before_action :verify_authenticity_token

    # GET /reports or /reports.json
    def index
      pagy, reports = pagy(Report.all, items: 20)

      render json: {
        reports: reports, pagination: pagy_metadata(pagy)
      }, each_serializer: ReportSerializer, status: :ok
    end

    def new
      @report = Report.new

      render json: @report, serializer: ReportSerializer, status: :ok
    end

    def show; end

    def edit; end

    def create
      binding.remote_pry
      @report = Report.new(report_params)

      if @report.save
        if image_params[:image_urls].present?
          image_urls = image_params[:image_urls]&.first&.split('🐶')&.reject(&:blank?)
          image_urls.each do |url|
            @report.images.attach(io: URI.open(url), filename: File.basename(URI.parse(url).path))
          end
        end
        render json: @report, serializer: ReportSerializer, status: :created
      else
        render json: { errors: @report.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      respond_to do |format|
        if @report.update(report_params)
          if image_params[:image_urls].present?
            image_urls = image_params[:image_urls]&.first&.split('🐶')&.reject(&:blank?)
            image_urls.each do |url|
              @report.images.attach(io: URI.open(url), filename: File.basename(URI.parse(url).path))
            end
          end
          format.html { redirect_to report_url(@report), notice: 'Report was successfully updated.' }
          format.json { render :show, status: :ok, location: @report }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @report.errors, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @report.destroy!

      respond_to do |format|
        format.html { redirect_to reports_url, notice: 'Report was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    def search
      outcome = Reports::Search.run(search_params)
      if outcome.valid?
        @pagy, @reports = pagy(outcome.result, items: 20)
        render :index
      else
        redirect_to reports_url, alert: outcome.errors.full_messages.join(', ')
      end
    end

    private

    def set_report
      @report = Report.find(params[:id])
    end

    def report_params
      params.require(:report).fetch(:data, {}).permit(
        :title,
        :status,
        :name,
        :description,
        :gender,
        :species,
        :breed_1,  # Make sure to match your param keys
        :breed_2,
        :color_1,
        :color_2,
        :color_3
      )
    end
    
    def image_params
      params.require(:report).fetch(:data, {}).permit(
        image_urls: []
      )
    end    

    def search_params
      params.permit(:query)
    end
  end
end
