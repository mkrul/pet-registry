# frozen_string_literal: true

class ContactMessagesController < ApplicationController
  layout 'hotwire'

  def new
    @contact_form = ContactForm.new
  end

  def create
    @contact_form = ContactForm.new(contact_form_params)

    if @contact_form.valid?
      ContactMailer.contact_email(
        name: @contact_form.name,
        email: @contact_form.email,
        subject: @contact_form.subject.presence || 'Contact Form Submission',
        message: @contact_form.message
      ).deliver_later

      redirect_to contact_path, notice: "Thank you for your message! We'll get back to you soon."
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def contact_form_params
    params.require(:contact_form).permit(:name, :email, :subject, :message)
  end
end
