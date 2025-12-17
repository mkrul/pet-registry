# frozen_string_literal: true

module Reports
  class TipFormComponent < ViewComponent::Base
    attr_reader :report, :errors

    def initialize(report:, errors: [])
      @report = report
      @errors = errors
    end

    def form_id
      "tip_form_#{report.id}"
    end
  end
end
