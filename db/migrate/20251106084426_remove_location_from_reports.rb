# frozen_string_literal: true

class RemoveLocationFromReports < ActiveRecord::Migration[8.0]
  def up
    remove_index :reports, name: "index_reports_on_country_and_state" if index_exists?(:reports, [:country, :state], name: "index_reports_on_country_and_state")
    remove_column :reports, :area, :string
    remove_column :reports, :state, :string
    remove_column :reports, :country, :string
    remove_column :reports, :latitude, :float
    remove_column :reports, :longitude, :float
    remove_column :reports, :intersection, :string
  end

  def down
    add_column :reports, :area, :string
    add_column :reports, :state, :string
    add_column :reports, :country, :string
    add_column :reports, :latitude, :float
    add_column :reports, :longitude, :float
    add_column :reports, :intersection, :string
    add_index :reports, [:country, :state], name: "index_reports_on_country_and_state"
  end
end

