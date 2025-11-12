class ContactMailer < ApplicationMailer
  default to: 'lostpetsregistry.dev@gmail.com',
          from: 'noreply@lostpetsregistry.dev'

  def contact_email(name:, email:, subject:, message:)
    @name = name
    @email = email
    @subject = subject
    @message = message

    mail(
      reply_to: @email,
      subject: "Contact Form: #{@subject}"
    )
  end
end

