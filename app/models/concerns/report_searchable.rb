module ReportSearchable
  extend ActiveSupport::Concern

  included do
    searchkick word_middle: [:breed_1, :breed_2, :description, :title],
               text_middle: [:gender],
               searchable: [:breed_1, :breed_2, :description, :title],
               filterable: [:species, :gender, :color_1, :color_2, :color_3, :status, :country, :state, :area, :breed_1, :breed_2],
               suggest: [:breed_1, :breed_2],
               word_start: [:breed_1, :breed_2],
               settings: {
                 analysis: {
                   filter: {
                     breed_synonym: {
                       type: "synonym",
                       synonyms: [
                         "pitbull, pit bull, bully",
                       ]
                     }
                   },
                   analyzer: {
                     searchkick_word_search: {
                       type: "custom",
                       tokenizer: "standard",
                       filter: ["lowercase", "breed_synonym", "word_delimiter", "asciifolding"]
                     },
                     searchkick_word_middle_search: {
                       type: "custom",
                       tokenizer: "standard",
                       filter: ["lowercase", "breed_synonym", "word_delimiter", "asciifolding"]
                     }
                   }
                 }
               }

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
      status: status,
      country: country,
      state: state,
      area: area,
      updated_at: updated_at,
      created_at: created_at
    }
  end

  private

  def reindex_report
    reindex
  end
end