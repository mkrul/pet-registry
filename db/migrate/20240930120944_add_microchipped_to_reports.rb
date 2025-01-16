class AddMicrochippedToReports < ActiveRecord::Migration[7.2]
  def change
    add_column :reports, :microchipped, :boolean, default: nil
  end
end
