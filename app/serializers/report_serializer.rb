class ReportSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :status, :species, :breed_1, :breed_2,
             :color_1, :color_2, :color_3, :name, :gender, :image,
             :microchipped, :microchip_id, :created_at, :updated_at, :archived_at

  def attributes(*args)
    data = super
    data.transform_keys! { |key| key.to_s.camelize(:lower) }
    data
  end

  def image
    return unless object.image.attached?

    public_id = object.image.blob.metadata['cloudinary_public_id']

    image_data = {
      id: object.image.id,
      filename: object.image.filename,
      url: Cloudinary::Utils.cloudinary_url(public_id),
      variant_url: Cloudinary::Utils.cloudinary_url(
        public_id,
        width: 600,
        height: 600,
        crop: 'fill'
      ),
      thumbnail_url: Cloudinary::Utils.cloudinary_url(
        public_id,
        width: 150,
        height: 150,
        crop: 'fill'
      )
    }

    image_data.transform_keys! { |key| key.to_s.camelize(:lower) }
    image_data
  end
end