class ChangeJtiToRememberToken < ActiveRecord::Migration[7.2]
  def change
    rename_column :users, :jti, :remember_token
  end
end
