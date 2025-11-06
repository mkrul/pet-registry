class Report < ApplicationRecord
  include BreedList
  include GenderList
  include ImageValidations
  include ColorValidations
  include ReportValidations
  include ReportSearchable
  include ReportNormalizations


  STATUS_ACTIVE = 'active'.freeze
  STATUS_ARCHIVED = 'archived'.freeze

  has_one_attached :image, service: :cloudinary_reports, dependent: :destroy

  belongs_to :user
  has_one :pet, dependent: :nullify
  has_many :events, as: :eventable
  has_many :tips, -> { where(category: Events::Report::Tip::CATEGORY) }, class_name: 'Event', as: :eventable

  enum :status, { active: STATUS_ACTIVE, archived: STATUS_ARCHIVED }

  after_update :update_pet_status_on_archive, if: :saved_change_to_status?
  after_destroy :update_pet_status_on_destroy

  REPORT_INDEX_PAGE_LIMIT = 20

  def associate_with_pet(pet)
    return unless pet.is_a?(Pet)

    pet.update!(report_id: id)
  end

  def cache_latest_tip_location
    @cached_tip_location ||= begin
      recent_tip = tips
        .where("data->>'latitude' IS NOT NULL AND data->>'longitude' IS NOT NULL")
        .where("data->>'latitude' != '' AND data->>'longitude' != ''")
        .order(created_at: :desc)
        .first

      if recent_tip
        {
          area: recent_tip.area,
          state: recent_tip.state,
          country: recent_tip.country
        }
      else
        {}
      end
    end
  end

  def cached_area
    cache_latest_tip_location[:area]
  end

  def cached_state
    cache_latest_tip_location[:state]
  end

  def cached_country
    cache_latest_tip_location[:country]
  end

  private

  def update_pet_status_on_archive
    if archived? && pet.present?
      pet.update!(report_id: nil, status: Pet::STATUS_HOME)
    end
  end

  def update_pet_status_on_destroy
    if pet.present?
      pet.update!(report_id: nil, status: Pet::STATUS_HOME)
    end
  end
end
