class CreateAttachmentGroups < ActiveRecord::Migration[8.0]
  def change
    create_table :attachments_groups do |t|
      t.string :title, null: false
      t.text :description
      t.timestamps
    end
  end
end
