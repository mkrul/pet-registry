# frozen_string_literal: true

module ApplicationHelper
  include Pagy::Frontend

  def log(init_string=nil, string)
    init_string = ">>>>" if init_string.nil?

    Rails.logger.info "\n\n#{init_string} #{string}\n\n"
  end
end
