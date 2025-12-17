# frozen_string_literal: true

module Reports
  class TipComponent < ViewComponent::Base
    attr_reader :tip, :report

    def initialize(tip:, report:)
      @tip = tip
      @report = report
    end

    def has_location?
      tip.area.present? || tip.state.present? || tip.country.present? || tip.intersection.present?
    end

    def has_map_link?
      tip.latitude.present? && tip.longitude.present?
    end

    def has_message?
      tip.message.present?
    end

    def has_links?
      unique_external_links.any?
    end

    def has_content?
      has_location? || has_map_link? || has_message? || has_links?
    end

    def location_display
      parts = []
      parts << tip.intersection if tip.intersection.present?
      parts << tip.area if tip.area.present?

      state_display = if tip.state.present?
                        tip.state.length > 2 ? tip.state[0, 2].upcase : tip.state
                      end
      parts << state_display if state_display.present?
      parts << tip.country if tip.country.present? && tip.state.blank?

      parts.join(", ")
    end

    def google_maps_url
      return nil unless has_map_link?

      "https://www.google.com/maps?q=#{tip.latitude},#{tip.longitude}"
    end

    def unique_external_links
      return [] unless tip.external_links.present?

      message_urls = extract_urls_from_text(tip.message)
      google_maps_pattern = "google.com/maps"

      tip.external_links.reject do |link|
        message_urls.include?(link) || link.include?(google_maps_pattern)
      end
    end

    def formatted_date
      return nil unless tip.created_at

      tip.created_at.strftime("%m/%d/%Y")
    end

    def formatted_time
      return nil unless tip.created_at

      tip.created_at.strftime("%l:%M %p").strip
    end

    def dom_id
      "tip_#{tip.id}"
    end

    private

    def extract_urls_from_text(text)
      return [] if text.blank?

      text.scan(%r{https?://[^\s]+}).flatten
    end
  end
end
