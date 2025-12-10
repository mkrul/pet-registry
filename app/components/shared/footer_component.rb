# frozen_string_literal: true

module Shared
  class FooterComponent < ApplicationComponent
    def initialize(current_year: Time.current.year)
      @current_year = current_year
    end

    private

    def footer_links
      [
        { text: "About", path: "/about" },
        { text: "Contact", path: "/contact" },
        { text: "Privacy Policy", path: "/privacy" },
        { text: "Terms of Service", path: "/terms" }
      ]
    end
  end
end
