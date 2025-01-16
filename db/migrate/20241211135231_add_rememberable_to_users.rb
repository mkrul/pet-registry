class AddRememberableToUsers < ActiveRecord::Migration[7.2]
  def change
    # add_column :users, :remember_created_at, :datetime
    add_column :users, :remember_token, :string
  end
end
