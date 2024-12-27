class ChangeCoordinatesToFloat < ActiveRecord::Migration[7.2]
  def change
    change_column :reports, :latitude, :float
    change_column :reports, :longitude, :float
  end
end