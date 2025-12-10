# frozen_string_literal: true

module Ui
  class SpinnerComponent < ApplicationComponent
    SIZES = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12"
    }.freeze

    def initialize(size: :md, label: "Loading...")
      @size = size.to_sym
      @label = label
    end

    private

    def spinner_classes
      class_names(
        "animate-spin text-green-600 dark:text-green-400",
        SIZES[@size]
      )
    end
  end
end
