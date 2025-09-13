class CreateReport
  def initialize
    @report = Report.new
  end

  def call(params)
    @report.assign_attributes(params.except(:image_url))

    handle_image(@report, params[:image_url])

    if @report.save
      @report
    else
      if @report.errors.any?
        puts "Errors while creating report for '#{@report.title}': #{@report.errors.full_messages.join(', ')}"
      end
      nil
    end
  end

  def handle_image(report, image_url)
    local_path = Rails.root.join('app', 'assets', 'images', 'reports', File.basename(image_url))
    attach_image(report, local_path)
  end

  def attach_image(report, local_path)
    file_content = File.read(local_path, mode: 'rb')
    file_io = StringIO.new(file_content)

    content_type = case File.extname(local_path).downcase
                   when '.jpg', '.jpeg'
                     'image/jpeg'
                   when '.png'
                     'image/png'
                   else
                     'image/jpeg'
                   end

    report.image.attach(
      io: file_io,
      filename: File.basename(local_path),
      content_type: content_type
    )
  end
end
