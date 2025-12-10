# frozen_string_literal: true

module Shared
  class NavbarComponent < ApplicationComponent
    def initialize(current_user: nil)
      @current_user = current_user
    end

    private

    def logged_in?
      @current_user.present?
    end

    def nav_links
      [
        { text: "Home", path: root_path },
        { text: "About", path: about_path },
        { text: "Contact", path: contact_path }
      ]
    end

    def about_path
      "/about"
    end

    def contact_path
      "/contact"
    end
  end
end
