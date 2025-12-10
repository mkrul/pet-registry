# frozen_string_literal: true

class ApplicationComponent < ViewComponent::Base
  include Pagy::Frontend

  private

  def class_names(*args)
    args.flatten.compact.join(' ')
  end
end
