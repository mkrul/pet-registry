class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :created_at

  def attributes(*args)
    data = super
    data.transform_keys! { |key| key.to_s.camelize(:lower) }
    data
  end
end