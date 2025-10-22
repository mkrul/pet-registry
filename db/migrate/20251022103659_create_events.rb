class CreateEvents < ActiveRecord::Migration[8.0]
  def change
    create_table :events do |t|
      t.string :category, null: false
      t.string :eventable_type, null: false
      t.bigint :eventable_id, null: false
      t.references :user, null: false, foreign_key: true
      t.jsonb :data, default: {}

      t.timestamps
    end

    add_index :events, [:eventable_type, :eventable_id]
    add_index :events, :category
  end
end
