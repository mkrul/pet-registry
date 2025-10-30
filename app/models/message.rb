class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :user

  has_many :read_receipts, class_name: 'MessageReadReceipt', dependent: :destroy

  validates :body, presence: true
end


