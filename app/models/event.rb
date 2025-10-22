class Event < ApplicationRecord
  include Events::Report::Tip

  belongs_to :eventable, polymorphic: true
  belongs_to :user

  validates :category, presence: true
  validate :data_must_be_hash

  scope :by_category, ->(category) { where(category: category) }

  private

  def data_must_be_hash
    unless data.is_a?(Hash)
      errors.add(:data, 'must be a hash')
    end
  end
end

