class CloudinaryService
  class CloudinaryError < StandardError; end

  OPTIONS = {
    overwrite: true,
    invalidate: true
  }

  def self.upload_image(file_path)
    response = Cloudinary::Uploader.upload(file_path, OPTIONS)
    raise CloudinaryError, response['error']['message'] if response['error']

    response
  end

  def self.update_image(file_path, public_id)
    options = OPTIONS.merge(public_id: public_id)
    response = Cloudinary::Uploader.upload(file_path, options)
    raise CloudinaryError, response['error']['message'] if response['error']

    response
  end

  def self.delete_image(public_id)
    response = Cloudinary::Uploader.destroy(public_id, invalidate: true, resource_type: 'image')
    raise CloudinaryError, response['error']['message'] if response['error']

    response
  end
end
