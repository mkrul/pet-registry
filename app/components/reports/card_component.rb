# frozen_string_literal: true

module Reports
  class CardComponent < ViewComponent::Base
    attr_reader :report, :current_page, :current_query

    def initialize(report:, current_page: 1, current_query: "")
      @report = report
      @current_page = current_page
      @current_query = current_query
    end

    def report_url
      report_path(report, query: current_query, page: current_page)
    end

    def image_url
      return "/images/placeholder.png" unless report.image.attached?

      blob_key = report.image.blob.key
      public_id = if report.image.blob.service_name == 'cloudinary_reports'
                    "#{Rails.env}/reports/#{blob_key}"
                  else
                    blob_key
                  end

      Cloudinary::Utils.cloudinary_url(
        public_id,
        width: 600,
        height: 600,
        crop: 'fill'
      )
    rescue StandardError
      "/images/placeholder.png"
    end

    def truncated_title
      report.title.length > 25 ? "#{report.title[0, 25]}..." : report.title
    end

    def breed_display
      return nil if report.breed_1.blank?

      if report.breed_2.present?
        "#{report.breed_1} / #{report.breed_2}"
      else
        report.breed_1
      end
    end

    def last_seen_location
      location = fetch_last_seen_location
      return nil if location.blank?

      area = location[:area]
      state = location[:state]
      intersection = location[:intersection]

      return nil if area.blank? && state.blank?

      state_abbrev = state.to_s.length > 2 ? state.to_s[0, 2].upcase : state.to_s

      if intersection.present? && intersection != ""
        "#{intersection} in #{area}, #{state_abbrev}"
      else
        "#{area}, #{state_abbrev}"
      end
    end

    def fetch_last_seen_location
      @last_seen_location ||= begin
        recent_tip = report.tips
          .where("data->>'latitude' IS NOT NULL AND data->>'longitude' IS NOT NULL")
          .where("data->>'latitude' != '' AND data->>'longitude' != ''")
          .order(created_at: :desc)
          .first

        if recent_tip
          {
            area: recent_tip.area,
            state: recent_tip.state,
            country: recent_tip.country,
            latitude: recent_tip.latitude&.to_f,
            longitude: recent_tip.longitude&.to_f,
            intersection: recent_tip.intersection
          }
        end
      end
    end

    def recently_created?
      return false unless report.created_at >= 1.hour.ago
      return false if report.updated_at > report.created_at + 10.seconds
      true
    end

    def recently_updated?
      return false if recently_created?
      return false if Time.current - report.created_at <= 1.hour

      time_between_update_and_creation = report.updated_at - report.created_at
      return true if time_between_update_and_creation > 5.seconds && report.updated_at >= 24.hours.ago

      false
    end

    def ring_style
      if recently_created?
        "ring-4 ring-blue-500 rounded-lg"
      elsif recently_updated?
        "ring-4 ring-green-500 rounded-lg"
      else
        ""
      end
    end

    def badge_type
      if recently_created?
        :new
      elsif recently_updated?
        :updated
      end
    end

    def formatted_date
      report.updated_at.strftime("%m/%d/%Y")
    end

    def formatted_time
      report.updated_at.strftime("%l:%M %p %Z").strip
    end
  end
end
