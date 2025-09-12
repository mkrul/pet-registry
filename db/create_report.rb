class CreateReport
  def initialize
    @report = Report.new
  end

  def call(params)
    @report.assign_attributes(params.except(:image_url))

    # Attach image before saving to pass validation
    handle_image(@report, params[:image_url])

    if @report.save
      @report
    else
      if @report.errors.any?
        puts "Errors while creating report with title '#{@report.title}': #{@report.errors.full_messages.join(', ')}"
      end
      nil
    end
  end

  def handle_image(report, image_url)
    # Handle both old and new image paths
    if image_url.include?('/app/public/images/')
      local_path = Rails.root.join('public', 'images', File.basename(image_url))
    else
      local_path = Rails.root.join('app', 'assets', 'images', 'reports', File.basename(image_url))
    end
    attach_image(report, local_path)
  end

  def attach_image(report, local_path)
    report.image.attach(
      io: File.open(local_path),
      filename: File.basename(local_path)
    )
  end
end
