class PetSerializer < ActiveModel::Serializer
  attributes :id, :name, :species, :breed_1, :breed_2,
             :color_1, :color_2, :color_3, :gender, :image, :is_altered,
             :microchip_id, :report_id, :status, :created_at, :updated_at, :archived_at

  def attributes(*args)
    data = super
    data.transform_keys! { |key| key.to_s.camelize(:lower) }
    data
  end

  def is_altered
    object.is_altered
  end

  def species
    object.species&.capitalize
  end

  def color_1
    object.color_1&.capitalize
  end

  def color_2
    object.color_2&.capitalize
  end

  def color_3
    object.color_3&.capitalize
  end

  def gender
    object.gender&.titleize
  end

  def status
    object.missing? ? 'missing' : 'home'
  end

  def image
    return unless object.image.attached?

    blob_key = object.image.blob.key
    public_id = if object.image.blob.service_name == 'cloudinary_pets'
                  "#{Rails.env}/pets/#{blob_key}"
                else
                  blob_key
                end

    image_data = {
      id: object.image.id,
      filename: object.image.filename.to_s,
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