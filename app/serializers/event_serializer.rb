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
      else
        {
          type: object.eventable_type || 'Unknown',
          id: object.eventable_id
        }
      end
    end
  rescue => e
    Rails.logger.error "EventSerializer#eventable_summary: Error serializing event #{object.id}: #{e.message}"
    {
      type: object.eventable_type || 'Unknown',
      id: object.eventable_id
    }
  end
end
