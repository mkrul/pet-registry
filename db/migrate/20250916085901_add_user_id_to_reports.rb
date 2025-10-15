class AddUserIdToReports < ActiveRecord::Migration[8.0]
  def change
    add_reference :reports, :user, null: false, default: 1

    # Update any existing reports with null user_id to use the first user
    if User.exists?
      first_user_id = User.first.id
      execute "UPDATE reports SET user_id = #{first_user_id} WHERE user_id IS NULL"
    end
  end
end
