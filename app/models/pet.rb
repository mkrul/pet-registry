class Pet < ApplicationRecord
  include BreedList
  include GenderList
  include ColorValidations
  include PetValidations
  include PetNormalizations

  has_one_attached :image, service: :cloudinary_pets, dependent: :destroy

  belongs_to :user
  belongs_to :report, optional: true

  scope :active, -> { where(deleted_at: nil) }
  scope :by_species, ->(species) { where(species: species) }

  def soft_delete!
    update!(deleted_at: Time.current)
  end

  def active?
    deleted_at.nil?
  end

  def missing?
    report.present? && report.active?
  end

  def home?
    !missing?
  end


end
