# frozen_string_literal: true

module FeatureFlags
  class << self
    def use_hotwire?
      ENV.fetch('USE_HOTWIRE', 'false') == 'true'
    end

    def hotwire_enabled_for?(user)
      return false unless use_hotwire?
      return true if ENV['HOTWIRE_FOR_ALL'] == 'true'

      user&.admin?
    end
  end
end
