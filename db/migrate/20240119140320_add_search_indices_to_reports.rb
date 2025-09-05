class AddSearchIndicesToReports < ActiveRecord::Migration[7.2]
  def change
    add_index :reports, :status
    add_index :reports, :species
    add_index :reports, [:country, :state]
  end
end