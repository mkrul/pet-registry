# frozen_string_literal: true

class UserSerializer < ActiveModel::Serializer
  attributes :id, :email

  def attributes(*args)
    hash = super
    hash[:id] = object.id
    hash[:email] = object.email
    hash
  end
end