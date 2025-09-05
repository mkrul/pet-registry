class Report < ApplicationRecord
  include BreedList
  include GenderList
  include LocationValidations
  include ImageValidations
  include ColorValidations
  include ReportValidations
  include ReportSearchable
  include ReportNormalizations

  has_one_attached :image, dependent: :destroy

  enum :altered, { altered: 1, intact: 0, unknown: nil }

  REPORT_INDEX_PAGE_LIMIT = 21
end
