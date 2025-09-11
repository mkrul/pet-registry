module LocationValidations
  extend ActiveSupport::Concern

  included do
    # Core location fields are required for all reports
    validates :area, presence: { message: "is required" }
    validates :country, presence: { message: "is required" }
    validates :latitude, presence: { message: "is required" }
    validates :longitude, presence: { message: "is required" }

    # State is required unless it's Washington (special case)
    validates :state, presence: { message: "is required" },
            unless: -> { area&.downcase == "washington" },
            allow_blank: true

    # Country must be United States
    validates :country, inclusion: {
      in: ["United States"],
      message: "must be United States"
    }

    # Optional field validations
    validates :intersection, length: { maximum: 100, message: "must be 100 characters or less" }, allow_blank: true
  end
end