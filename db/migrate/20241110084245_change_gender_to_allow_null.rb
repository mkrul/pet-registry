class ChangeGenderToAllowNull < ActiveRecord::Migration[7.2]
  def change
    change_column_null :reports, :gender, true
  end
end
