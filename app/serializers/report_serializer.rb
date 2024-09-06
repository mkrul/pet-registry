# app/serializers/report_serializer.rb
class ReportSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :status, :species, :breed_1, :breed_2,
             :color_1, :color_2, :color_3, :name, :gender

  has_many :images

  def archived_at
    object.archived_at&.iso8601
  end

  def created_at
    object.created_at.iso8601
  end

  def updated_at
    object.updated_at.iso8601
  end

  def images
    object.images.map do |image|
      {
        url: Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true)
      }
    end
  end
end
