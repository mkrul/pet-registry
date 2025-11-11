class EventSerializer < ActiveModel::Serializer
  attributes :id, :category, :created_at, :eventable_type, :eventable_id, :eventable_summary

  def eventable_summary
    if object.eventable
    case object.eventable_type
    when 'Report'
      {
        type: 'Report',
        id: object.eventable.id,
        title: object.eventable.title,
        status: object.eventable.status
      }
    when 'Pet'
      {
        type: 'Pet',
        id: object.eventable.id,
        name: object.eventable.name,
        species: object.eventable.species
      }
    when 'Conversation'
      {
        type: 'Conversation',
        id: object.eventable.id,
        recipient_id: object.eventable.recipient_id,
        messageable_type: object.eventable.messageable_type,
        messageable_id: object.eventable.messageable_id
      }
    else
      {
        type: object.eventable_type,
        id: object.eventable.id
      }
      end
    else
      case object.eventable_type
      when 'Report'
        {
          type: 'Report',
          id: object.eventable_id,
          title: object.data['title'] || 'Deleted Report',
          status: 'deleted'
        }
      when 'Pet'
        {
          type: 'Pet',
          id: object.eventable_id,
          name: object.data['name'] || 'Deleted Pet',
          species: object.data['species'] || 'Unknown'
        }
      when 'Conversation'
        {
          type: 'Conversation',
          id: object.eventable_id,
          recipient_id: object.data['recipient_id'],
          messageable_type: object.data['messageable_type'],
          messageable_id: object.data['messageable_id']
        }
      else
        {
          type: object.eventable_type || 'Unknown',
          id: object.eventable_id
        }
      end
    end
  rescue => _error
    {
      type: object.eventable_type || 'Unknown',
      id: object.eventable_id
    }
  end
end
