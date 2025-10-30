class Conversation < ApplicationRecord
  belongs_to :sender, class_name: 'User'
  belongs_to :recipient, class_name: 'User'
  belongs_to :messageable, polymorphic: true, optional: true

  has_many :messages, dependent: :destroy

  validates :sender_id, presence: true
  validates :recipient_id, presence: true

  scope :for_user, ->(user_id) { where("sender_id = ? OR recipient_id = ?", user_id, user_id) }

  def other_participant_for(user)
    user.id == sender_id ? recipient : sender
  end
end


