# frozen_string_literal: true

# Configure ActiveStorage to use model-specific folder structure for Cloudinary
Rails.application.configure do
  # Override the Cloudinary service to use custom folder structure based on blob metadata
  ActiveStorage::Service::CloudinaryService.class_eval do
    def upload(key, io, filename: nil, content_type: nil, **options)
      # Extract folder from options or use default
      folder_path = options[:folder] || "#{Rails.env}/default"

      upload_options = {
        public_id: "#{folder_path}/#{key}",
        overwrite: true,
        invalidate: true
      }

      response = Cloudinary::Uploader.upload(io, upload_options)

      if response["error"]
        raise ActiveStorage::FileNotFoundError, response["error"]["message"]
      end

      response
    end
  end

  # Override ActiveStorage::Blob to include folder metadata
  ActiveStorage::Blob.class_eval do
    def attach_to(record, name, **options)
      # Store the model's folder configuration in metadata
      folder_name = extract_folder_name(record, name)
      self.metadata = (metadata || {}).merge(folder: folder_name)

      super
    end

    private

    def extract_folder_name(record, attachment_name)
      # Check if the model has a cloudinary_folder method
      if record.class.respond_to?(:cloudinary_folder)
        record.class.cloudinary_folder
      else
        # Default to the model's plural name
        record.class.model_name.plural
      end
    end
  end

  # Override ActiveStorage::Attachment to pass folder to service
  ActiveStorage::Attachment.class_eval do
    def upload_to_service
      folder_path = "#{Rails.env}/#{blob.metadata['folder']}"

      blob.service.upload(
        blob.key,
        blob.download,
        filename: blob.filename.to_s,
        content_type: blob.content_type,
        folder: folder_path
      )
    end
  end
end
