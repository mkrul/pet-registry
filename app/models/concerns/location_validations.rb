module LocationValidations
  extend ActiveSupport::Concern

  included do
    validates :area, presence: { message: "is required" }, if: -> { latitude.present? || longitude.present? }
    validates :state, presence: { message: "is required" },
            if: -> { (latitude.present? || longitude.present?) && country.downcase != "united states" || area.downcase != "washington" },
            allow_blank: true
    validates :country, presence: { message: "is required" }, if: -> { latitude.present? || longitude.present? }
    validates :country, inclusion: {
      in: ["United States"],
      message: "must be United States"
    }, if: -> { latitude.present? || longitude.present? }
    validates :latitude, presence: { message: "is required" }, if: -> { area.present? || state.present? || country.present? }
    validates :longitude, presence: { message: "is required" }, if: -> { area.present? || state.present? || country.present? }
    validates :intersection, length: { maximum: 100, message: "must be 100 characters or less" }, allow_blank: true
  end
end