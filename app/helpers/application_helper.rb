# frozen_string_literal: true

module ApplicationHelper
  include Pagy::Frontend

  def log(string, init_string=nil)
    init_string = ">>>>" if init_string.nil?

    Rails.logger.info "\n\n#{init_string} #{string}\n\n"
  end
end
