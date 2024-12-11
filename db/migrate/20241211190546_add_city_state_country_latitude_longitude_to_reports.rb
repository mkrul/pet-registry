class AddCityStateCountryLatitudeLongitudeToReports < ActiveRecord::Migration[7.2]
  def change
    add_column :reports, :city, :string
    add_column :reports, :state, :string
    add_column :reports, :country, :string
    add_column :reports, :latitude, :decimal, precision: 10, scale: 6
    add_column :reports, :longitude, :decimal, precision: 10, scale: 6
  end
end