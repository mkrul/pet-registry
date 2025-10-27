class AddSettingsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :settings, :jsonb, default: {
      email_notifications: true,
      allow_contact: true,
      dark_mode: false
    }, null: false
    add_index :users, :settings, using: :gin
  end
end
