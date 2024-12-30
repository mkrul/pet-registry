class UpdateCoordinateColumns < ActiveRecord::Migration[7.2]
  def change
    change_column :reports, :latitude, :decimal, precision: 10, scale: 6, default: nil
    change_column :reports, :longitude, :decimal, precision: 10, scale: 6, default: nil
  end
end