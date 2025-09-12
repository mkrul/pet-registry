# frozen_string_literal: true

module CloudinaryFolderConfiguration
  extend ActiveSupport::Concern

  class_methods do
    def set_cloudinary_folder(folder_name)
      @cloudinary_folder = folder_name
    end

    def cloudinary_folder
      @cloudinary_folder || model_name.plural
    end
  end
end
