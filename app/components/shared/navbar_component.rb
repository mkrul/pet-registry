# frozen_string_literal: true

module Shared
  class NavbarComponent < ViewComponent::Base
    def initialize(current_user:)
      @current_user = current_user
    end

    def authenticated?
      @current_user.present?
    end

    def nav_links
      links = []
      links << { path: "/dashboard/reports?action=create", label: "New Report" } if authenticated?
      links << { path: "/reports", label: "Search" }
      links << { path: about_path, label: "About" }
      links << { path: "/contact", label: "Contact" }
      links
    end

    def desktop_nav_links
      links = nav_links.dup
      links << { path: new_user_session_path, label: "Log In" } unless authenticated?
      links
    end

    def mobile_nav_links
      links = nav_links.dup
      links << { path: new_user_session_path, label: "Log In" } unless authenticated?
      links
    end
  end
end
