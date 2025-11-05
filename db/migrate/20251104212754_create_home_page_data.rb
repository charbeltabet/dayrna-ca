class CreateHomePageData < ActiveRecord::Migration[8.0]
  def change
    create_table :home_page_data do |t|
      t.jsonb :data, default: {}, null: false

      t.timestamps
    end

    add_index :home_page_data, :data, using: :gin
  end
end
