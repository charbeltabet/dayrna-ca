class CreateAttachmentGroupMemberships < ActiveRecord::Migration[8.0]
  def change
    create_table :attachment_group_memberships do |t|
      t.references :record_attachment, null: false, foreign_key: true
      t.references :attachments_group, null: false, foreign_key: true

      t.timestamps
    end

    # Add unique index to prevent duplicate associations
    add_index :attachment_group_memberships,
              [:record_attachment_id, :attachments_group_id],
              unique: true,
              name: "index_attachment_group_memberships_on_attachment_and_group"
  end
end
