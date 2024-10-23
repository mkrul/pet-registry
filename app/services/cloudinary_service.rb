class CloudinaryService
  class CloudinaryError < StandardError; end

  def self.upload_image(file_path, options = {})
    response = Cloudinary::Uploader.upload(file_path, options)
    raise CloudinaryError, response['error']['message'] if response['error']

    response
  end

  def self.update_image(public_id, options = {})
    response = Cloudinary::Uploader.explicit(public_id, options)
    raise CloudinaryError, response['error']['message'] if response['error']

    response
  end

  def self.delete_image(public_id)
    response = Cloudinary::Uploader.destroy(public_id, invalidate: true, resource_type: 'image')
    raise CloudinaryError, response['error']['message'] if response['error']

    response
  end
end
