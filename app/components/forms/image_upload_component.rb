# frozen_string_literal: true

module Forms
  class ImageUploadComponent < ApplicationComponent
    def initialize(
      form:,
      attribute:,
      label: nil,
      hint: nil,
      required: false,
      accept: "image/*",
      max_size_mb: 10,
      preview_url: nil
    )
      @form = form
      @attribute = attribute
      @label = label
      @hint = hint
      @required = required
      @accept = accept
      @max_size_mb = max_size_mb
      @preview_url = preview_url
    end

    private

    def label_text
      text = @label || @attribute.to_s.humanize
      text += " *" if @required
      text
    end

    def has_errors?
      @form.object&.errors&.include?(@attribute)
    end

    def error_message
      @form.object&.errors&.full_messages_for(@attribute)&.first
    end

    def max_size_bytes
      @max_size_mb * 1024 * 1024
    end

    def default_hint
      "PNG, JPG, GIF up to #{@max_size_mb}MB"
    end
  end
end
