class ChangeCityToArea < ActiveRecord::Migration[7.2]
  def change
    rename_column :reports, :city, :area
  end
end
