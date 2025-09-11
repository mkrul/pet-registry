class ChangeIsAlteredToBoolean < ActiveRecord::Migration[8.0]
  def change
    change_column :reports, :is_altered, :boolean,
                  default: nil,
                  using: 'CASE WHEN is_altered = 1 THEN true WHEN is_altered = 0 THEN false ELSE NULL END'
  end
end
