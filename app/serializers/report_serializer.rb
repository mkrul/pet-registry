class ReportSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :status, :species, :breed_1, :breed_2,
             :color_1, :color_2, :color_3, :name, :gender, :image, :altered,
             :microchip_id, :created_at, :updated_at, :archived_at,
             :recently_updated, :recently_created,
             :area, :state, :country, :latitude, :longitude, :intersection

  def attributes(*args)
    data = super
    data.transform_keys! { |key| key.to_s.camelize(:lower) }
    data
  end

  def altered
    return true if object.altered == 1

    return false if object.altered == 0

    nil
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

  def recently_created
    return false unless object.created_at >= 1.hour.ago

    time_difference = (object.updated_at.to_i - object.created_at.to_i).abs
    return false if time_difference > 5

    true
  end

  def recently_updated
    time_since_creation = Time.current - object.created_at
    time_between_update_and_creation = (object.updated_at.to_i - object.created_at.to_i).abs

    if time_since_creation <= 24.hours && time_between_update_and_creation <= 5
      return false
    end

    if time_since_creation <= 24.hours && time_between_update_and_creation > 5
      return true
    end

    object.updated_at >= 24.hours.ago
  end

  def intersection
    object&.intersection
  end
end