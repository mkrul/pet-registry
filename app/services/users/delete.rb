# frozen_string_literal: true

require 'active_interaction'

module Users
  class Delete < ActiveInteraction::Base
    record :user, class: ::User

    def execute
      ActiveRecord::Base.transaction do
        system_user = find_or_create_system_user

        reassign_tip_events!(from_user: user, to_user: system_user)

        destroy_user!

        true
      end
    end

    private

    def find_or_create_system_user
      ::User.find_or_create_by!(email: 'lostpetregistry.dev@gmail.com') do |u|
        u.password = SecureRandom.hex(16)
        u.password_confirmation = u.password
        u.settings = { email_notifications: false, allow_contact: false, dark_mode: false }
      end
    end

    def reassign_tip_events!(from_user:, to_user:)
      ::Event.where(category: Events::Report::Tip::CATEGORY, user_id: from_user.id).update_all(user_id: to_user.id)
    end

    def destroy_user!
      user.destroy!
    end
  end
end


