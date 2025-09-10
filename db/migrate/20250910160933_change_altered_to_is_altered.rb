class ChangeAlteredToIsAltered < ActiveRecord::Migration[8.0]
  def change
    rename_column :reports, :altered, :is_altered
  end
end
