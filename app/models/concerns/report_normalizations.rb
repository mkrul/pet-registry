module ReportNormalizations
  extend ActiveSupport::Concern

  included do
    normalizes :gender, with: ->(value) { value.downcase }
  end
end