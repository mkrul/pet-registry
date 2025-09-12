class Report < ApplicationRecord
  include BreedList
  include GenderList
  include LocationValidations
  include ImageValidations
  include ColorValidations
  include ReportValidations
  include ReportSearchable
  include ReportNormalizations
  include CloudinaryFolderConfiguration

  has_one_attached :image, dependent: :destroy

  # Configure the folder name for this model's Cloudinary uploads
  cloudinary_folder 'reports'

  enum :status, { active: 'active', archived: 'archived' }

  REPORT_INDEX_PAGE_LIMIT = 21
end
