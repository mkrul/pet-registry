# frozen_string_literal: true

class MessageSerializer < ActiveModel::Serializer
  attributes :id, :body, :created_at, :user, :read_at

  def user
    { id: object.user.id, display_name: object.user.display_name || object.user.email }
  end

  def read_at
    receipt = object.read_receipts.where(user_id: scope[:current_user].id).first
    receipt&.read_at
  end
end


