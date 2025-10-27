class RemovePhoneNumberFromUsers < ActiveRecord::Migration[8.0]
  def change
    remove_column :users, :phone_number, :string
  end
end
