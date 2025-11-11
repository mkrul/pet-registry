# frozen_string_literal: true

class MigrateReportLocationsToTips < ActiveRecord::Migration[8.0]
  def up
    reports_with_location = Report.where.not(
      area: [nil, ''],
      country: [nil, ''],
      latitude: nil,
      longitude: nil
    )

    reports_with_location.find_each do |report|
      tip_data = {
        message: 'Initial location when reported',
        area: report.area,
        state: report.state,
        country: report.country,
        latitude: report.latitude.to_s,
        longitude: report.longitude.to_s
      }

      tip_data[:intersection] = report.intersection if report.intersection.present?

      Event.create!(
        eventable: report,
        user: report.user,
        category: Events::Report::Tip::CATEGORY,
        data: tip_data,
        created_at: report.created_at,
        updated_at: report.created_at
      )
    end
  end

  def down
    Event.where(category: Events::Report::Tip::CATEGORY)
         .where("data->>'message' = ?", 'Initial location when reported')
         .destroy_all
  end
end

