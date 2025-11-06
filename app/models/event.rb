class Event < ApplicationRecord
  include Events::Report::Tip
  include Events::Report::Create
  include Events::Report::Update
  include Events::Report::Archive
  include Events::Report::Delete
  include Events::Pet::Create
  include Events::Pet::Update
  include Events::Pet::Archive
  include Events::Conversation::Create

  belongs_to :eventable, polymorphic: true, optional: true
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

