
require 'open-uri'

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
        puts "Errors while creating report with title '#{@report.title}': #{@report.errors.full_messages.join(', ')}"
      end
    end
  end

  def handle_image(report, image_url)
    local_path = Rails.root.join('app', 'assets', 'images', 'reports', File.basename(image_url))

    public_id = report.cloudinary_public_id
    folder = "Home/petregistry/#{Rails.env}/reports"

    report.image.attach(
      io: File.open(local_path),
      filename: File.basename(image_url),
      content_type: mime_type(local_path),
      metadata: {
        cloudinary: {
          public_id: public_id,
          folder: folder,
          overwrite: true,
          invalidate: true
        }
      }
    )
  rescue => e
    puts "Failed to attach image for report '#{report.title}': #{e.message}"
  end

  private

  # Helper method to determine MIME type based on file extension
  def mime_type(file_path)
    case File.extname(file_path).downcase
    when '.jpg', '.jpeg'
      'image/jpeg'
    when '.png'
      'image/png'
    when '.gif'
      'image/gif'
    else
      'application/octet-stream'
    end
  end
end
