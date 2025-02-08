class AddAlteredToReports < ActiveRecord::Migration[8.0]
  def change
    add_column :reports, :altered, :integer, default: nil, null: true
  end
end
