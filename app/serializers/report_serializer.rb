# app/serializers/report_serializer.rb

class ReportSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :status, :species, :breed_1, :breed_2,
             :color_1, :color_2, :color_3, :name, :gender, :images,
             :microchipped, :microchip_id, :created_at, :updated_at, :archived_at

  def attributes(*args)
    data = super
    data.transform_keys! { |key| key.to_s.camelize(:lower) }
    data
  end

  def images
    object.images.map do |image|
      public_id = image.blob.metadata['cloudinary_public_id']
      next unless public_id

      {
        id: image.id,
        url: Cloudinary::Utils.cloudinary_url(public_id),
        thumbnail_url: Cloudinary::Utils.cloudinary_url(
          public_id,
          width: 150,
          height: 150,
          crop: 'fill'
        )
      }
    end
  end
end
