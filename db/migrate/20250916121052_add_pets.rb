class AddPets < ActiveRecord::Migration[8.0]
  def change
    create_table :pets do |t|
      t.string :name, null: false
      t.string :species, null: false
      t.string :breed_1, null: false
      t.string :breed_2
      t.string :color_1, null: false
      t.string :color_2
      t.string :color_3
      t.string :gender
      t.string :microchip_id
      t.boolean :is_altered
      t.datetime :deleted_at
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end
  end
end
