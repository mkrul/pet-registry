class ChangeDeletedAtToArchivedAtInPets < ActiveRecord::Migration[8.0]
  def change
    rename_column :pets, :deleted_at, :archived_at
  end
end
