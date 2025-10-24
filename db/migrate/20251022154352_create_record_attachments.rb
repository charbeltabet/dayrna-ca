class CreateRecordAttachments < ActiveRecord::Migration[8.0]
  def change
    create_table :record_attachments do |t|
      t.string :record_type
      t.bigint :record_id
      t.string :title
      t.text :description
      t.bigint :cached_file_size
      t.jsonb :metadata, default: {}

      t.timestamps
    end

    add_index :record_attachments, [ :record_type, :record_id ]
  end
end
