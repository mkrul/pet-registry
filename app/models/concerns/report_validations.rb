module ReportValidations
  extend ActiveSupport::Concern


  # We want the ability to add an "event" to a report.  We'll need to have a new db table called events.  One report should have many events.  In this case the events will be of type
  # Events::Reports::Tip

  # Any user should be able to click on a report and view it (http://localhost:3000/reports/85?query=&page=1), then click a button to add an event for the report.  Eventually we might use report events to track other things, but for now we want to allow users to submit a tip as a report event that shows where the animal was last seen.

  # The Report::Event tips shoould display on the map.

  included do
    validates :title,
            presence: { message: "cannot be blank" },
            length: { maximum: 50, message: "must be 50 characters or less" }

    validates :name,
      presence: { message: "cannot be blank" },
      length: { maximum: 30, message: "must be 30 characters or less" },
      format: { with: /\A[a-zA-Z0-9\s\-\.]+\z/, message: "can only contain letters, numbers, spaces, hyphens, and periods" },
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
      uniqueness: { allow_nil: true, message: "is already registered", conditions: -> { where.not(status: 'archived') } },
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
    }, allow_blank: true, allow_nil: true
  end
end