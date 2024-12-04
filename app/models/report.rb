class Report < ApplicationRecord
  include Normalizable

  searchkick word_middle: [:title, :description, :breed_1, :breed_2, :name],
             searchable: [:title, :description, :breed_1, :breed_2, :name],
             filterable: [:species, :gender, :color_1, :color_2, :color_3, :status],
             suggest: [:title, :description],
             settings: {
               analysis: {
                 analyzer: {
                   searchkick_word_search: {
                     type: "custom",
                     tokenizer: "standard",
                     filter: ["lowercase", "word_delimiter"]
                   }
                 }
               }
             }

  def search_data
    {
      title: title,
      description: description,
      species: species&.downcase,
      breed_1: breed_1,
      breed_2: breed_2,
      color_1: color_1&.downcase,
      color_2: color_2&.downcase,
      color_3: color_3&.downcase,
      name: name,
      gender: gender&.downcase,
      status: status,
      updated_at: updated_at,
      created_at: created_at
    }
  end

  after_commit :reindex_report

  def reindex_report
    reindex
  end

  validates :title, presence: true, length: { maximum: 30 }
  validates :name, length: { maximum: 20 }, allow_nil: true
  validates :description, presence: true, length: { maximum: 500 }
  validates :status, presence: true, inclusion: { in: %w[active archived] }
  validates :breed_1, presence: true
  validates :color_1, presence: true
  validates :species, presence: true, inclusion: { in: %w[dog cat] }
  validates :microchip_id, uniqueness: { allow_nil: true }, length: { maximum: 35 }

  normalizes :title,
             :description,
             :status,
             :archived_at,
             :name,
             :species,
             :breed_1,
             :breed_2,
             :color_1,
             :color_2,
             :color_3,
             :gender,
             :microchipped,
             :microchip_id,
             with: ->(value) { value.presence || nil }

  validate :image_size_within_limit?
  validate :unique_colors
  validate :unique_breeds

  has_one_attached :image, dependent: :destroy

  REPORT_PAGE_LIMIT = 20

  private

  def unique_colors
    colors = [color_1, color_2, color_3].compact.reject(&:blank?)
    duplicates = colors.select { |color| colors.count(color) > 1 }.uniq

    if duplicates.any?
      errors.add(:base, "Duplicate colors found: #{duplicates.join(', ')}")
    end
  end

  def unique_breeds
    breeds = [breed_1, breed_2].compact.reject(&:blank?)
    duplicates = breeds.select { |breed| breeds.count(breed) > 1 }.uniq

    if duplicates.any?
      errors.add(:base, "Duplicate breeds found: #{duplicates.join(', ')}")
    end
  end

  def image_size_within_limit?
    errors.add(:image, 'size cannot exceed 5MB') if image.attached? && image.blob.byte_size > 5.megabytes
  end
end
