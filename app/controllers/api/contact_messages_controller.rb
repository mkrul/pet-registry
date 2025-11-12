# frozen_string_literal: true

module Api
  class ContactMessagesController < ApplicationController
    def create
      if request.content_type != 'application/json'
        return render json: { error: 'Invalid content type' }, status: :bad_request
      end

      contact_params = contact_message_params
      return render json: { error: 'Missing required parameters' }, status: :bad_request unless contact_params

      if contact_params[:name].blank? || contact_params[:email].blank? || contact_params[:message].blank?
        return render json: { error: 'Name, email, and message are required' }, status: :unprocessable_entity
      end

      ContactMailer.contact_email(
        name: contact_params[:name],
        email: contact_params[:email],
        subject: contact_params[:subject] || 'Contact Form Submission',
        message: contact_params[:message]
      ).deliver_later

      render json: { message: 'Contact message sent successfully' }, status: :ok
    rescue StandardError => e
      render json: { error: 'Failed to send contact message' }, status: :internal_server_error
    end

    private

    def contact_message_params
      if params[:contact_message]
        params.require(:contact_message).permit(:name, :email, :subject, :message)
      elsif params[:contact]
        params.require(:contact).permit(:name, :email, :subject, :message)
      end
    rescue ActionController::ParameterMissing
      nil
    end
  end
end

