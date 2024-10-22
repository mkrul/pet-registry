# app/serializers/report_serializer.rb
class ReportSerializer < ActiveModel::Serializer
  attributes :id,
             :title,
             :description,
             :status,
             :species,
             :breed_1,
             :breed_2,
             :color_1,
             :color_2,
             :color_3,
             :name,
             :gender,
             :images,
             :microchipped,
             :microchip_id,
             :created_at,
             :updated_at,
             :archived_at

  def attributes(*args)
    data = super
    data.transform_keys! { |key| key.to_s.camelize(:lower) }

    data
  end

  def images
    object.images.map do |image|
      {
        id: image.id,
        url: Rails.application.routes.url_helpers.rails_blob_url(
          image,
          host: Rails.application.config.action_controller.default_url_options[:host],
          port: Rails.application.config.action_controller.default_url_options[:port]
        ),
        thumbnail_url: Rails.application.routes.url_helpers.rails_representation_url(
          image.variant(resize: '150x150').processed,
          host: Rails.application.config.action_controller.default_url_options[:host],
          port: Rails.application.config.action_controller.default_url_options[:port]
        )
      }
    end
  end


end
