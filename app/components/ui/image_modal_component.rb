# frozen_string_literal: true

module Ui
  class ImageModalComponent < ViewComponent::Base
    attr_reader :image_url, :alt_text, :caption

    def initialize(image_url:, alt_text: "", caption: nil)
      @image_url = image_url
      @alt_text = alt_text
      @caption = caption
    end
  end
end
