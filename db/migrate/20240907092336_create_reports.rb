# frozen_string_literal: true

class CreateReports < ActiveRecord::Migration[7.2]
  def change
    create_table :reports do |t|
      t.string :title, null: false
      t.string :status, null: false
      t.datetime :archived_at
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
      t.text :description, null: false
      t.string :species, null: false
      t.string :breed_1, null: false
      t.string :breed_2
      t.string :color_1, null: false
      t.string :color_2
      t.string :color_3
      t.string :name, null: false
      t.string :gender, null: false
      t.string :microchip_id
      t.string :area
      t.string :state
      t.string :country
      t.float :latitude
      t.float :longitude
    end
  end
end
