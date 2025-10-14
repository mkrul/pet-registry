class AddStatusToPet < ActiveRecord::Migration[8.0]
  def change
    add_column :pets, :status, :string, null: false
  end
end
