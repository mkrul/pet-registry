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

end
