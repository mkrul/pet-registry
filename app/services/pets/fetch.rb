# frozen_string_literal: true

require 'active_interaction'

class Pets::Fetch < ActiveInteraction::Base
  integer :user_id
  string :species, default: nil
  integer :page, default: 1
  integer :per_page, default: 21

  def execute
    pets_query = Pet.active.where(user_id: user_id)
                   .includes(:image_attachment)
                   .order(created_at: :desc)

    if species.present?
      pets_query = pets_query.where(species: species)
    end

    total_count = pets_query.count
    offset = (page - 1) * per_page
    pets = pets_query.limit(per_page).offset(offset)

    PaginatedCollection.new(
      pets.to_a,
      total: total_count,
      page: page,
      per_page: per_page
    )
  end
end
