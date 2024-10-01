# config/initializers/active_storage_extension.rb
Rails.application.reloader.to_prepare do
  ActiveStorage::Blob.class_eval do
    def thumbnail_url(width: 150, height: 150, crop: 'fill')
      Cloudinary::Utils.cloudinary_url(key, transformation: { width: width, height: height, crop: crop })
    end
  end
end
