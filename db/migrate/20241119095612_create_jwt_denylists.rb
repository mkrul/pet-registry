class CreateJwtDenylists < ActiveRecord::Migration[7.2]
  def change
    create_table :jwt_denylists do |t|
      t.string :identifier
      t.datetime :expiration

      t.timestamps
    end

    add_index :jwt_denylists, :identifier
  end
end
