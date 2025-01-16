class ChangeNameToAllowNull < ActiveRecord::Migration[7.2]
  def change
    change_column_null :reports, :name, true
  end
end
