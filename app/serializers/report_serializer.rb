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
             :microchipped,
             :microchip_id,
             :created_at,
             :updated_at,
             :archived_at

  def attributes(*args)
    data = super
    data.transform_keys! { |key| key.to_s.camelize(:lower) }
    data.merge!({
      createdAt: created_at&.iso8601,
      updatedAt: updated_at&.iso8601,
      archivedAt: archived_at&.iso8601
    })
    data
  end

  def images
    object.images.map do |image|
      {
        url: Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true),
        thumbnail_url: image.blob.thumbnail_url
      }
    end
  end
end
