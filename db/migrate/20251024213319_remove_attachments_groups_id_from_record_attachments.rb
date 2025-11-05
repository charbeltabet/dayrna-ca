class RemoveAttachmentsGroupsIdFromRecordAttachments < ActiveRecord::Migration[8.0]
  def change
    remove_foreign_key :record_attachments, :attachments_groups if foreign_key_exists?(:record_attachments, :attachments_groups)
    remove_column :record_attachments, :attachments_groups_id, :bigint
  end
end
