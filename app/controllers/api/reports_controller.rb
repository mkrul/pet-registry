# frozen_string_literal: true

module Api
  class ReportsController < ApplicationController

    before_action :set_report, only: %i[show edit update destroy archive]
    before_action :authenticate_user!, only: [:user_reports, :create, :archive]
    skip_before_action :verify_authenticity_token

    def index
      start_time = Time.current
      page = (params[:page] || 1).to_i
      per_page = (params[:per_page] || Report::REPORT_INDEX_PAGE_LIMIT).to_i

      search_params = {
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
      }

      result = Reports::Search.run(search_params)
      search_time = ((Time.current - start_time) * 1000).round(2)

      if result.valid?
        reports = result.result
        Rails.logger.info "Search completed in #{search_time}ms: #{reports.total_entries} total entries, #{reports.to_a.length} in current page"
        render json: {
          data: ActiveModelSerializers::SerializableResource.new(reports.to_a, each_serializer: ReportSerializer),
          pagination: {
            pages: reports.total_pages,
            count: reports.total_entries,
            page: reports.current_page,
            items: reports.per_page,
            per_page: Report::REPORT_INDEX_PAGE_LIMIT
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
          title: nil,
          description: nil,
          name: nil,
          gender: nil,
          species: nil,
          breed_1: nil,
          breed_2: nil,
          color_1: nil,
          color_2: nil,
          color_3: nil,
          microchip_id: nil,
          area: nil,
          state: nil,
          country: nil,
          latitude: nil,
          longitude: nil,
          intersection: nil
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
      Rails.logger.info("Create params received: #{report_params.inspect}")

      if report_params[:pet_id].present?
        pet = Pet.find_by(id: report_params[:pet_id], user_id: current_user.id)
        if pet&.image&.attached?
          report_attributes = report_params.except(:pet_id).merge(user_id: current_user.id)
          outcome = Reports::CopyFromPet.run(pet: pet, report_attributes: report_attributes)
        else
          outcome = Reports::Create.run(report_params.merge(user_id: current_user.id))
        end
      else
        outcome = Reports::Create.run(report_params.merge(user_id: current_user.id))
      end

      if outcome.valid?
        serialized_report = ReportSerializer.new(outcome.result).as_json
        render json: serialized_report.merge(
          message: "Report created successfully"
        ), status: :created
      else
        Rails.logger.error("Validation failed: #{outcome.errors.full_messages}")
        render json: {
          errors: outcome.errors.full_messages,
          message: outcome.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
      end
    end

    def update
      outcome = Reports::Update.run(report_params.merge(report: @report))

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

    def archive
      if @report.user != current_user
        render json: { message: "You can only archive your own reports" }, status: :forbidden
        return
      end

      if @report.archived?
        render json: { message: "Report is already archived" }, status: :unprocessable_entity
        return
      end

      @report.update!(status: "archived", archived_at: Time.current)

      render json: { message: "Report archived successfully" }, status: :ok
    rescue StandardError => e
      render json: { message: "Failed to archive report", error: e.message }, status: :unprocessable_entity
    end

    def copy_from_pet
      outcome = Reports::CopyFromPet.run(pet: @pet, report_attributes: report_params)

      if outcome.valid?
        serialized_report = ReportSerializer.new(outcome.result).as_json
        render json: serialized_report.merge(
          message: "Report copied from pet successfully"
        ), status: :created
      else
        render json: { errors: outcome.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def user_reports
      page = (params[:page] || 1).to_i
      per_page = (params[:per_page] || Report::REPORT_INDEX_PAGE_LIMIT).to_i

      reports_query = Report.where(user: current_user)
                            .includes(:image_attachment)
                            .order(created_at: :desc)

      if params[:status].present?
        reports_query = reports_query.where(status: params[:status])
      else
        # Default: show only active reports
        reports_query = reports_query.where(status: 'active')
      end

      total_count = reports_query.count
      offset = (page - 1) * per_page
      reports = reports_query.limit(per_page).offset(offset)

      paginated_reports = PaginatedCollection.new(
        reports.to_a,
        total: total_count,
        page: page,
        per_page: per_page
      )

      render json: {
        data: ActiveModelSerializers::SerializableResource.new(paginated_reports.to_a, each_serializer: ReportSerializer),
        pagination: {
          pages: paginated_reports.total_pages,
          count: paginated_reports.total_entries,
          page: paginated_reports.current_page,
          items: paginated_reports.per_page,
          per_page: Report::REPORT_INDEX_PAGE_LIMIT
        },
        message: paginated_reports.empty? ? "You haven't created any reports yet." : nil
      }
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
        :is_altered,
        :pet_id,
        :status
      )
    end

  end
end
