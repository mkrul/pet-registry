class AddIntersectionToReports < ActiveRecord::Migration[7.2]
  def change
    add_column :reports, :intersection, :string, null: true
  end
end
