class Report < ApplicationRecord
  include BreedList
  include GenderList
  include LocationValidations
  include ImageValidations
  include ColorValidations
  include ReportValidations
  include ReportSearchable
  include ReportNormalizations
  has_one_attached :image, service: :cloudinary_reports, dependent: :destroy

  belongs_to :user
  has_many :pets, dependent: :nullify

  enum :status, { active: 'active', archived: 'archived' }

  after_update :update_pet_status_on_archive, if: :saved_change_to_status?

  REPORT_INDEX_PAGE_LIMIT = 21

  def associate_with_pet(pet)
    return unless pet.is_a?(Pet)

    pet.update!(report_id: id)
  end

  private

  def update_pet_status_on_archive
    if archived? && pets.any?
      pets.update_all(report_id: nil)
    end
  end
end
