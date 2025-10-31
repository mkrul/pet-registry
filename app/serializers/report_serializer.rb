class ReportSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :status, :species, :breed_1, :breed_2,
             :color_1, :color_2, :color_3, :name, :gender, :image, :is_altered,
             :microchip_id, :created_at, :updated_at, :archived_at,
             :recently_updated, :recently_created,
             :area, :state, :country, :latitude, :longitude, :intersection, :pet_id,
             :last_seen_location, :user_id

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

  def image
    return unless object.image.attached?

    # For cloudinary_reports service, we need to include the folder path
    blob_key = object.image.blob.key
    public_id = if object.image.blob.service_name == 'cloudinary_reports'
                  "#{Rails.env}/reports/#{blob_key}"
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

  def latitude
    object.latitude.to_f if object.latitude
  end

  def longitude
    object.longitude.to_f if object.longitude
  end

  def recently_created
    return false unless object.created_at >= 1.hour.ago
    return false if object.updated_at > object.created_at + 10.seconds
    true
  end

  def recently_updated
    return false if recently_created
    return false if Time.current - object.created_at <= 1.hour

    time_between_update_and_creation = object.updated_at - object.created_at
    return true if time_between_update_and_creation > 5.seconds && object.updated_at >= 24.hours.ago

    false
  end

  def intersection
    object&.intersection
  end

  def pet_id
    object.pet&.id
  end

  def last_seen_location
    recent_tip = object.tips
      .where("data->>'latitude' IS NOT NULL AND data->>'longitude' IS NOT NULL")
      .where("data->>'latitude' != '' AND data->>'longitude' != ''")
      .order(created_at: :desc)
      .first

    if recent_tip
      {
        area: recent_tip.area,
        state: recent_tip.state,
        country: recent_tip.country,
        latitude: recent_tip.latitude&.to_f,
        longitude: recent_tip.longitude&.to_f,
        intersection: recent_tip.intersection,
        source: 'tip'
      }
    else
      {
        area: object.area,
        state: object.state,
        country: object.country,
        latitude: object.latitude&.to_f,
        longitude: object.longitude&.to_f,
        intersection: object.intersection,
        source: 'report'
      }
    end
  end
end