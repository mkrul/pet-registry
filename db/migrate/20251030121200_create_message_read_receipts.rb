class CreateMessageReadReceipts < ActiveRecord::Migration[7.2]
  def change
    create_table :message_read_receipts do |t|
      t.references :message, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.datetime :read_at
      t.timestamps
    end

    add_index :message_read_receipts, [:message_id, :user_id], unique: true, name: 'index_read_receipts_on_message_and_user'
  end
end


