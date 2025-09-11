module ReportValidations
  extend ActiveSupport::Concern

  included do
    validates :title,
            presence: { message: "cannot be blank" },
            length: { maximum: 50, message: "must be 50 characters or less" }

    validates :name,
      presence: { message: "cannot be blank" },
      length: { maximum: 30, message: "must be 30 characters or less" },
      format: { with: /\A[a-zA-Z0-9\s\-]+\z/, message: "can only contain letters, numbers, spaces, and hyphens" },
      allow_blank: true,
      allow_nil: true

    validates :description,
      presence: { message: "cannot be blank" },
      length: { maximum: 500, message: "must be 500 characters or less" }

    validates :status,
      presence: true,
      inclusion: { in: %w[active archived], message: "must be either active or archived" }

    validates :breed_1,
      presence: { message: "cannot be blank" }

    validates :color_1,
      presence: { message: "cannot be blank" }

    validates :species,
      presence: { message: "cannot be blank" },
      inclusion: { in: %w[dog cat], message: "must be either dog or cat" }

    validates :microchip_id,
      uniqueness: { allow_nil: true, message: "is already registered" },
      length: { maximum: 35, message: "must be 35 characters or less" },
      format: { with: /\A[A-Za-z0-9\-]+\z/, message: "can only contain letters, numbers, and hyphens" },
      allow_blank: true,
      allow_nil: true

    validates :is_altered,
      inclusion: { in: [true, false], allow_nil: true },
      allow_blank: true,
      allow_nil: true

    validates :gender,
      inclusion: {
      in: %w[male female],
      message: "must be either Male or Female"
    }
  end
end