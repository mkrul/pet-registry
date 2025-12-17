# frozen_string_literal: true

class ReportsController < ApplicationController
  layout 'hotwire'

  before_action :set_report, only: [:show, :submit_tip, :tip_form]
  before_action :authenticate_user!, only: [:submit_tip, :tip_form]

  def index
    search_params = {
      query: params[:query],
      species: params[:species],
      color: params[:color],
      gender: params[:gender],
      state: params[:state],
      sort: params[:sort].presence || 'Newest',
      page: params[:page] || 1,
      per_page: Report::REPORT_INDEX_PAGE_LIMIT
    }

    result = Reports::Search.run(search_params)

    if result.valid?
      reports = result.result
      @pagy = Pagy.new(
        count: reports.total_entries,
        page: reports.current_page,
        items: reports.per_page
      )
      @reports = reports
      @filters = filter_params
    else
      @reports = []
      @pagy = Pagy.new(count: 0, page: 1)
      @filters = filter_params
      flash.now[:alert] = result.errors.full_messages.join(", ")
    end

    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  def show
    @tips_page = (params[:tips_page] || 1).to_i
    @tips_per_page = 5

    tips_query = @report.tips.includes(:user).order(created_at: :desc)
    total_tips = tips_query.count
    offset = (@tips_page - 1) * @tips_per_page
    @tips = tips_query.limit(@tips_per_page).offset(offset)

    @tips_pagy = Pagy.new(
      count: total_tips,
      page: @tips_page,
      items: @tips_per_page
    )

    @is_owner = current_user&.id == @report.user_id
    @can_submit_tip = current_user.present? && !@is_owner && @report.status != 'archived'
    @owner_allows_contact = owner_allows_contact?(@report)

    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  def tip_form
    render partial: "reports/tip_form", locals: { report: @report }
  end

  def submit_tip
    is_owner = current_user.id == @report.user_id
    is_archived = @report.status == 'archived'

    if is_owner
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "tip_form_#{@report.id}",
            partial: "reports/tip_form_error",
            locals: { error: "You cannot submit tips on your own report" }
          )
        end
        format.html { redirect_to report_path(@report), alert: "You cannot submit tips on your own report" }
      end
      return
    end

    if is_archived
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "tip_form_#{@report.id}",
            partial: "reports/tip_form_error",
            locals: { error: "This report is archived and no longer accepting tips" }
          )
        end
        format.html { redirect_to report_path(@report), alert: "This report is archived" }
      end
      return
    end

    tip_data = tip_params

    outcome = Events::Create.run(
      eventable: @report,
      user: current_user,
      category: Events::Report::Tip::CATEGORY,
      data: tip_data
    )

    if outcome.valid?
      @tips_page = 1
      @tips_per_page = 5
      tips_query = @report.tips.includes(:user).order(created_at: :desc)
      total_tips = tips_query.count
      @tips = tips_query.limit(@tips_per_page).offset(0)
      @tips_pagy = Pagy.new(count: total_tips, page: 1, items: @tips_per_page)

      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace("tips_list_#{@report.id}", partial: "reports/tips_list", locals: { tips: @tips, report: @report, pagy: @tips_pagy }),
            turbo_stream.replace("tip_form_#{@report.id}", partial: "reports/tip_form_success", locals: { report: @report }),
            turbo_stream.prepend("flash_messages", partial: "shared/toast", locals: { type: :success, message: "Tip submitted successfully!" })
          ]
        end
        format.html { redirect_to report_path(@report), notice: "Tip submitted successfully!" }
      end
    else
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "tip_form_#{@report.id}",
            partial: "reports/tip_form",
            locals: { report: @report, errors: outcome.errors.full_messages }
          )
        end
        format.html { redirect_to report_path(@report), alert: outcome.errors.full_messages.join(", ") }
      end
    end
  end

  private

  def tip_params
    params.permit(:message, :area, :state, :country, :latitude, :longitude, :intersection, external_links: [])
  end

  def set_report
    @report = Report.find(params[:id])
  end

  def filter_params
    {
      query: params[:query].to_s,
      species: params[:species].to_s,
      color: params[:color].to_s,
      gender: params[:gender].to_s,
      state: params[:state].to_s,
      sort: params[:sort].presence || 'Newest'
    }
  end

  def owner_allows_contact?(report)
    settings = report.user&.settings
    return true unless settings.is_a?(Hash)

    value = settings['allow_contact']
    value.nil? ? true : value
  end
end
