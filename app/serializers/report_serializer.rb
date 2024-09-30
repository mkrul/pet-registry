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
             :images

  def attributes(*args)
    data = super

    data.transform_keys! { |key| key.to_s.camelize(:lower) }
    data.merge!({
      'createdAt' => created_at,
      'updatedAt' => updated_at,
      'archivedAt' => archived_at
    })

    data
  end

  def created_at
    object.archived_at&.iso8601
  end

  def updated_at
    object.updated_at&.iso8601
  end

  def archived_at
    object.archived_at&.iso8601
  end

  def images
    object.images.map do |image|
      { url: image.url }
    end
  end
end
