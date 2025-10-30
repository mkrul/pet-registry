# frozen_string_literal: true

class ConversationSerializer < ActiveModel::Serializer
  attributes :id, :other_user, :last_message, :last_message_from_other, :unread_count, :messageable

  def other_user
    current = scope[:current_user]
    user = object.other_participant_for(current)
    { id: user.id, display_name: user.display_name }
  end

  def last_message
    msg = object.messages.order(created_at: :desc).first
    return nil unless msg
    {
      id: msg.id,
      body: msg.body.truncate(140),
      created_at: msg.created_at
    }
  end

  def last_message_from_other
    current = scope[:current_user]
    msg = object.messages.where.not(user_id: current.id).order(created_at: :desc).first
    return nil unless msg
    {
      id: msg.id,
      body: msg.body.truncate(140),
      created_at: msg.created_at
    }
  end

  def unread_count
    MessageReadReceipt.joins(:message)
      .where(user_id: scope[:current_user].id, messages: { conversation_id: object.id }, read_at: nil)
      .count
  end

  def messageable
    return nil unless object.messageable_type && object.messageable_id

    base = { type: object.messageable_type, id: object.messageable_id }

    if object.messageable_type == 'Report'
      report = ::Report.find_by(id: object.messageable_id)
      if report
        image_urls = nil
        if report.image.attached?
          blob_key = report.image.blob.key
          public_id = if report.image.blob.service_name == 'cloudinary_reports'
                        "#{Rails.env}/reports/#{blob_key}"
                      else
                        blob_key
                      end
          image_urls = {
            variant_url: Cloudinary::Utils.cloudinary_url(public_id, width: 200, height: 200, crop: 'fill'),
            thumbnail_url: Cloudinary::Utils.cloudinary_url(public_id, width: 80, height: 80, crop: 'fill')
          }
        end

        return base.merge(
          title: report.title,
          image: image_urls
        )
      end
    end

    base
  end
end


