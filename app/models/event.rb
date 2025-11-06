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

  after_commit :reindex_report_if_tip, on: [:create, :update]

  private

  def data_must_be_hash
    unless data.is_a?(Hash)
      errors.add(:data, 'must be a hash')
    end
  end

  def reindex_report_if_tip
    if category == Events::Report::Tip::CATEGORY && eventable.is_a?(Report)
      eventable.reindex
    end
  end
end

