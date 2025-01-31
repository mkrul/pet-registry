module LocationValidations
  extend ActiveSupport::Concern

  included do
    validates :area, presence: { message: "cannot be blank" }, if: -> { latitude.present? || longitude.present? }
    validates :state, presence: { message: "cannot be blank" },
            if: -> { (latitude.present? || longitude.present?) && country.downcase != "united states" || area.downcase != "washington" },
            allow_blank: true
    validates :country, presence: { message: "cannot be blank" }, if: -> { latitude.present? || longitude.present? }
    validates :country, inclusion: {
      in: ["United States"],
      message: "must be united states"
    }, if: -> { latitude.present? || longitude.present? }
    validates :latitude, presence: { message: "cannot be blank" }, if: -> { area.present? || state.present? || country.present? }
    validates :longitude, presence: { message: "cannot be blank" }, if: -> { area.present? || state.present? || country.present? }
    validates :intersection, length: { maximum: 100, message: "must be 100 characters or less" }, allow_blank: true
  end
end