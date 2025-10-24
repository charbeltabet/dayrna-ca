class AddAttachmentGroupsFkOnRecordAttachments < ActiveRecord::Migration[8.0]
  def change
    remove_index :record_attachments, [ :record_type, :record_id ]
    remove_column :record_attachments, :record_type, :string
    remove_column :record_attachments, :record_id, :bigint

    add_reference :record_attachments, :attachments_groups, foreign_key: true, index: true, null: true
  end
end
