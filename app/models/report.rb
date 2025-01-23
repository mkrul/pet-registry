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

  REPORT_INDEX_PAGE_LIMIT = 21
end
