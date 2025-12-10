# frozen_string_literal: true

module Ui
  class ModalComponent < ApplicationComponent
    def initialize(title: nil, size: :md)
      @title = title
      @size = size.to_sym
    end

    private

    def size_classes
      case @size
      when :sm then "max-w-md"
      when :md then "max-w-lg"
      when :lg then "max-w-2xl"
      when :xl then "max-w-4xl"
      else "max-w-lg"
      end
    end
  end
end
