class AddUserIdToReports < ActiveRecord::Migration[8.0]
  def change
    add_reference :reports, :user, null: false
  end
end
