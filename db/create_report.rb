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
    attach_image(report, local_path)
  end

  def attach_image(report, local_path)
    report.image.attach(
      io: File.open(local_path),
      filename: File.basename(local_path)
    )
  end
end
