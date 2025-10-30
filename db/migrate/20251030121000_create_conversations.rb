class CreateConversations < ActiveRecord::Migration[7.2]
  def change
    create_table :conversations do |t|
      t.references :sender, null: false, foreign_key: { to_table: :users }
      t.references :recipient, null: false, foreign_key: { to_table: :users }
      t.string :messageable_type
      t.bigint :messageable_id
      t.timestamps
    end

    add_index :conversations, [:sender_id, :recipient_id, :messageable_type, :messageable_id], unique: true, name: 'index_conversations_on_participants_and_messageable'
    add_index :conversations, [:messageable_type, :messageable_id], name: 'index_conversations_on_messageable'
  end
end


