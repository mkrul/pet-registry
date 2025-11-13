class NotificationMailer < ApplicationMailer
  layout "notification_mailer"

  default from: "noreply@lostpetsregistry.dev"

  def notification_email(user:, subject:, intro:, body_lines:, cta_label:, cta_url:, unsubscribe_url:, social_links: {}, preheader: nil, greeting: nil)
    @user = user
    @subject = subject
    @intro = intro
    @body_lines = Array(body_lines).flatten.compact
    @cta_label = cta_label
    @cta_url = cta_url
    @unsubscribe_url = unsubscribe_url
    @social_links = normalize_social_links(social_links)
    @greeting = greeting.presence || default_greeting_for(user)
    @preheader = preheader.presence || @intro.presence || @body_lines.first

    mail(
      to: user.email,
      subject: subject
    )
  end

  private

  def normalize_social_links(links)
    case links
    when Hash
      links.filter_map do |label, url|
        next if label.blank? || url.blank?

        { label: label, url: url }
      end
    when Array
      links.filter_map do |entry|
        label = entry[:label] || entry["label"]
        url = entry[:url] || entry["url"]
        next if label.blank? || url.blank?

        { label: label, url: url }
      end
    else
      []
    end
  end

  def default_greeting_for(user)
    name = if user.respond_to?(:first_name) && user.first_name.present?
      user.first_name
    elsif user.respond_to?(:name) && user.name.present?
      user.name
    elsif user.respond_to?(:full_name) && user.full_name.present?
      user.full_name
    else
      user.email
    end

    "Hi #{name},"
  end
end

