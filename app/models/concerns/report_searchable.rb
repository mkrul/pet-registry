module ReportSearchable
  extend ActiveSupport::Concern

  included do
    searchkick searchable: [:breed_1, :breed_2, :description, :title, :color_1, :color_2, :color_3, :species],
               filterable: [:status, :species, :gender, :country, :state, :area, :color_1, :color_2, :color_3],
               suggest: [:breed_1, :breed_2],
               batch_size: 200

    after_commit :reindex_report
  end

  def search_data
    {
      title: title&.downcase,
      description: description&.downcase,
      species: species&.downcase,
      breed_1: breed_1&.downcase,
      breed_2: breed_2&.downcase,
      color_1: color_1&.downcase,
      color_2: color_2&.downcase,
      color_3: color_3&.downcase,
      name: name&.downcase,
      gender: gender&.downcase,
      status: status&.downcase,
      country: country&.downcase,
      state: state&.downcase,
      area: area&.downcase,
      updated_at: updated_at,
      created_at: created_at
    }
  end

  private

  def reindex_report
    reindex
  end
end