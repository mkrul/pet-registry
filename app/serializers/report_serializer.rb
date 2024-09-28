# app/serializers/report_serializer.rb
class ReportSerializer < ActiveModel::Serializer
  attributes :id,
             :title,
             :description,
             :status,
             :species,
             :breed_1,
             :breed_2,
             :color_1,
             :color_2,
             :color_3,
             :name,
             :gender,
             :images,
             :archived_at,
             :created_at,
             :updated_at

  def attributes(*args)
    data = super

    data.transform_keys! { |key| key.to_s.camelize(:lower) }

    data
  end

  def images
    object.images.map do |image|
      { url: image.url }
    end
  end
end
