class CreateNavigations < ActiveRecord::Migration[8.0]
  def change
    create_table :navigations do |t|
      t.string :name
      t.string :url
      t.integer :navigation_parent_id
      t.integer :position

      t.timestamps
    end

    add_index :navigations, :navigation_parent_id
  end
end
