# frozen_string_literal: true

class CreateReport
  def initialize
    @report = Report.new
  end

  def call(params)
    @report.assign_attributes(params.except(:image_url))
    if @report.save
      handle_image(@report, params[:image_url])
    else
      if @report.errors.any?
        puts "Errors while creating report with title '#{report.title}': #{report.errors.full_messages.join(', ')}"
      end
    end
  end

  def handle_image(report, image_url)
    local_path = Rails.root.join('app', 'assets', 'images', 'reports', File.basename(image_url))

    response = CloudinaryService.upload_image(local_path)

    attach_image(report, response, image_url)
  end

  def attach_image(report, response, image_url)
    filename = File.basename(image_url)

    report.image.attach(
      io: URI.open(response['secure_url']),
      filename: filename.presence || response['public_id'],
      content_type: 'image/jpeg',
      metadata: {
        cloudinary_public_id: response['public_id']
      }
    )
  end
end
