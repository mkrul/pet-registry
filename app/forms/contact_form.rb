# frozen_string_literal: true

class ContactForm
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :name, :string
  attribute :email, :string
  attribute :subject, :string
  attribute :message, :string

  validates :name, presence: { message: "Name is required" }
  validates :email, presence: { message: "Email is required" },
                    format: { with: URI::MailTo::EMAIL_REGEXP, message: "Please enter a valid email address", allow_blank: true }
  validates :message, presence: { message: "Message is required" }
end
