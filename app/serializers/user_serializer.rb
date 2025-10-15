# frozen_string_literal: true

class UserSerializer < ActiveModel::Serializer
  attributes :email, :phone_number, :member_since, :created_at

  def attributes(*args)
    data = super
    data.transform_keys! { |key| key.to_s.camelize(:lower) }
    data
  end

  def member_since
    suffix = object.created_at.day.ordinalize
    object.created_at.strftime("%B #{suffix}, %Y")
  end
end