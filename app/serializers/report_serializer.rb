class ReportSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :status, :species, :breed_1, :breed_2,
             :color_1, :color_2, :color_3, :name, :gender, :image,
             :microchip_id, :created_at, :updated_at, :archived_at,
             :updated_last_x_days, :created_last_x_hours,
             :area, :state, :country, :latitude, :longitude

  def attributes(*args)
    data = super
    data.transform_keys! { |key| key.to_s.camelize(:lower) }
    data
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
    object.gender&.capitalize
  end

  def updated_last_x_days
    return nil unless object.updated_at

    object.updated_at > 3.days.ago
  end

  def image
    return unless object.image.attached?

    public_id = object.image.blob.key

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

  def latitude
    object.latitude.to_f if object.latitude
  end

  def longitude
    object.longitude.to_f if object.longitude
  end

  def created_last_x_hours
    return nil unless object.created_at

    object.created_at > 24.hours.ago
  end
end