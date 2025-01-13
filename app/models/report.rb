class Report < ApplicationRecord
  include BreedList
  include GenderList

  searchkick word_middle: [:breed_1, :breed_2, :description, :title],
             text_middle: [:gender],
             searchable: [:breed_1, :breed_2, :description, :title],
             filterable: [:species, :gender, :color_1, :color_2, :color_3, :status, :country, :state, :area, :breed_1, :breed_2],
             suggest: [:breed_1, :breed_2],
             word_start: [:breed_1, :breed_2],
             settings: {
               analysis: {
                 filter: {
                   breed_synonym: {
                     type: "synonym",
                     synonyms: [
                       "pitbull, pit bull, bully",
                     ]
                   }
                 },
                 analyzer: {
                   searchkick_word_search: {
                     type: "custom",
                     tokenizer: "standard",
                     filter: ["lowercase", "breed_synonym", "word_delimiter", "asciifolding"]
                   },
                   searchkick_word_middle_search: {
                     type: "custom",
                     tokenizer: "standard",
                     filter: ["lowercase", "breed_synonym", "word_delimiter", "asciifolding"]
                   }
                 }
               }
             }

  def search_data
    data = {
      title: title&.downcase,
      description: description&.downcase,
      species: species&.downcase,
      breed_1: breed_1&.downcase,
      breed_2: breed_2&.downcase,
      color_1: color_1&.downcase,
      color_2: color_2&.downcase,
      color_3: color_3&.downcase,
      name: name&.downcase,
      gender: gender&.downcase,
      status: status,
      country: country,
      state: state,
      area: area,
      updated_at: updated_at,
      created_at: created_at
    }

    Rails.logger.debug "Indexing report with data: #{data.inspect}"
    data
  end

  after_commit :reindex_report

  def reindex_report
    reindex
  end

  validates :title, presence: { message: "cannot be blank" }, length: { maximum: 30, message: "must be 30 characters or less" }

  validates :name, length: { maximum: 20, message: "must be 20 characters or less" },
                  format: { with: /\A[a-zA-Z0-9\s\-]+\z/, message: "Name can only contain letters, numbers, spaces, and hyphens" },
                  allow_blank: true

  validates :description, presence: { message: "cannot be blank" }, length: { maximum: 500, message: "must be 500 characters or less" }

  validates :status, presence: true, inclusion: { in: %w[active archived], message: "must be either active or archived" }
  validates :breed_1, presence: { message: "cannot be blank" }
  validates :color_1, presence: { message: "cannot be blank" }
  validates :species, presence: { message: "cannot be blank" },
                     inclusion: { in: %w[dog cat], message: "must be either dog or cat" }
  validates :microchip_id, uniqueness: { allow_nil: true, message: "ID is already registered" },
                          length: { maximum: 35, message: "ID must be 35 characters or less" },
                          format: { with: /\A[A-Za-z0-9\-]+\z/, message: "ID can only contain letters, numbers, and hyphens" },
                          allow_blank: true
  validates :area, presence: { message: "cannot be blank" }, if: -> { latitude.present? || longitude.present? }
  validates :state, presence: { message: "cannot be blank" },
          if: -> { (latitude.present? || longitude.present?) && country.downcase != "united states" || area.downcase != "washington" },
          allow_blank: true
  validates :country, presence: { message: "cannot be blank" }, if: -> { latitude.present? || longitude.present? }
  validates :country, inclusion: { in: %w[united states], message: "must be united states" }, if: -> { latitude.present? || longitude.present? }
  validates :latitude, presence: { message: "cannot be blank" }, if: -> { area.present? || state.present? || country.present? }
  validates :longitude, presence: { message: "cannot be blank" }, if: -> { area.present? || state.present? || country.present? }

  normalizes :status,
             :archived_at,
             :name,
             :species,
             :color_1,
             :color_2,
             :color_3,
             :gender,
             :microchip_id,
             with: ->(value) { value.presence&.downcase || nil }

  normalizes :title,
             :description,
             with: ->(value) { value.presence }

  validate :image_size_within_limit?
  validate :unique_colors
  validate :unique_breeds
  validate :validate_breeds
  validate :validate_gender
  validate :validate_image_format

  has_one_attached :image, dependent: :destroy

  REPORT_PAGE_LIMIT = 20
  VALID_IMAGE_TYPES = %w[image/jpeg image/png image/gif].freeze
  MAX_IMAGE_SIZE = 5.megabytes

  before_save :format_coordinates

  def format_coordinates
    if latitude_changed? || longitude_changed?
      self[:latitude] = self[:latitude].to_f if self[:latitude]
      self[:longitude] = self[:longitude].to_f if self[:longitude]
    end
  end

  private

  def unique_colors
    colors = [color_1, color_2, color_3].compact.reject(&:blank?)
    duplicates = colors.select { |color| colors.count(color) > 1 }.uniq

    if duplicates.any?
      errors.add(:base, "Each color must be unique. Duplicate colors found: #{duplicates.join(', ')}")
    end
  end

  def unique_breeds
    breeds = [breed_1, breed_2].compact.reject(&:blank?)
    duplicates = breeds.select { |breed| breeds.count(breed) > 1 }.uniq

    if duplicates.any?
      errors.add(:base, "Each breed must be unique. Duplicate breeds found: #{duplicates.join(', ')}")
    end
  end

  def image_size_within_limit?
    if image.attached? && image.blob.byte_size > MAX_IMAGE_SIZE
      errors.add(:image, "must be less than 5MB")
    end
  end

  def validate_breeds
    return unless species.present?

    valid_breeds = self.class.valid_breeds_for(species)

    if breed_1.present? && !valid_breeds.any? { |breed| breed.casecmp?(breed_1) }
      errors.add(:breed_1, "is not a valid breed for #{species}")
    end

    if breed_2.present? && !valid_breeds.any? { |breed| breed.casecmp?(breed_2) }
      errors.add(:breed_2, "is not a valid breed for #{species}")
    end
  end

  def validate_gender
    return if gender.blank?

    valid_genders = self.class.valid_genders
    unless valid_genders.any? { |valid_gender| valid_gender.casecmp?(gender) }
      errors.add(:gender, "must be one of: #{valid_genders.join(', ')}")
    end
  end

  def validate_image_format
    return unless image.attached?

    unless VALID_IMAGE_TYPES.include?(image.content_type)
      errors.add(:image, "must be a JPEG, PNG, or GIF")
    end
  end
end
