class AddAdditionalSearchIndicesToReports < ActiveRecord::Migration[7.2]
  def change
    add_index :reports, :created_at
    add_index :reports, :updated_at
    add_index :reports, :archived_at
  end
end