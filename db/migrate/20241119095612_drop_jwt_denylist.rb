class DropJwtDenylist < ActiveRecord::Migration[7.2]
  def up
    drop_table :jwt_denylists
  end

  def down
    create_table :jwt_denylists do |t|
      t.string :identifier
      t.datetime :expiration

      t.timestamps
      t.index :identifier
    end
  end
end