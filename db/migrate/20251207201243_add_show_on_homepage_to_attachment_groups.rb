class AddShowOnHomepageToAttachmentGroups < ActiveRecord::Migration[8.0]
  def change
    change_table :attachments_groups do |t|
      t.boolean :show_on_homepage, default: true, null: false
    end
  end
end
