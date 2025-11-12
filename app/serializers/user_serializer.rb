# frozen_string_literal: true

class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :display_name, :member_since, :created_at, :settings, :admin

  def attributes(*args)
    data = super
    data.transform_keys! { |key| key.to_s.camelize(:lower) }
    data
  end

  def settings
    raw_settings = object.settings
    return {} unless raw_settings.is_a?(Hash)

    raw_settings.each_with_object({}) do |(key, value), memo|
      memo[key.to_s.camelize(:lower)] = value
    end
  end

  def member_since
    suffix = object.created_at.day.ordinalize
    object.created_at.strftime("%B #{suffix}, %Y")
  end
end