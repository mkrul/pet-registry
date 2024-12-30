class RemoveMicrochippedFromReports < ActiveRecord::Migration[7.2]
  def change
    remove_column :reports, :microchipped
  end
end
