class AddReportIdToPets < ActiveRecord::Migration[8.0]
  def change
    add_reference :pets, :report, null: true
  end
end
