# frozen_string_literal: true

class UserSerializer < ActiveModel::Serializer
  attributes :member_since

  def member_since
    suffix = object.created_at.day.ordinalize
    object.created_at.strftime("%B #{suffix}, %Y")
  end
end