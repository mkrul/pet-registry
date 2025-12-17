# frozen_string_literal: true

module Shared
  class FooterComponent < ViewComponent::Base
    def initialize(current_user:)
      @current_user = current_user
    end

    def authenticated?
      @current_user.present?
    end

    def current_year
      Date.current.year
    end

    def nav_links
      links = []
      links << { path: "/dashboard/reports?action=create", label: "New Report" } if authenticated?
      links << { path: "/reports", label: "Search" }
      links << { path: about_path, label: "About" }
      links << { path: "/contact", label: "Contact" }
      links
    end
  end
end
