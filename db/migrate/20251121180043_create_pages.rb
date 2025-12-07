class CreatePages < ActiveRecord::Migration[8.0]
  def change
    create_table :pages do |t|
      t.string :title, null: false
      t.string :slug, null: false
      t.text :content
      t.integer :position, default: 0, null: false
      t.integer :navigation_id, null: false

      t.timestamps
    end

    add_index :pages, :navigation_id
    add_index :pages, [ :navigation_id, :slug ], unique: true
    add_foreign_key :pages, :navigations
  end
end
