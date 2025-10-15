class Pet < ApplicationRecord
  include BreedList
  include GenderList
  include ColorValidations
  include PetValidations
  include PetNormalizations

  STATUS_HOME = 'home'.freeze
  STATUS_MISSING = 'missing'.freeze
  STATUS_ARCHIVED = 'archived'.freeze

  has_one_attached :image, service: :cloudinary_pets, dependent: :destroy

  belongs_to :user
  belongs_to :report, optional: true

  scope :active, -> { where(archived_at: nil) }
  scope :by_species, ->(species) { where(species: species) }
  enum :status, { home: STATUS_HOME, missing: STATUS_MISSING, archived: STATUS_ARCHIVED }

  after_update :update_status_based_on_report, if: :saved_change_to_report_id?

  def soft_delete!
    update!(archived_at: Time.current)
  end

  def active?
    archived_at.nil? && status != STATUS_ARCHIVED
  end

  def missing?
    report.present? && status == STATUS_MISSING
  end

  def home?
    status == STATUS_HOME
  end

  private

  def update_status_based_on_report
    if report_id.present? && status != STATUS_MISSING
      update_column(:status, STATUS_MISSING)
    elsif report_id.nil? && status == STATUS_MISSING
      update_column(:status, STATUS_HOME)
    end
  end

end
