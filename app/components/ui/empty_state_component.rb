# frozen_string_literal: true

module Ui
  class EmptyStateComponent < ApplicationComponent
    def initialize(title:, description: nil, icon: nil)
      @title = title
      @description = description
      @icon = icon
    end
  end
end
