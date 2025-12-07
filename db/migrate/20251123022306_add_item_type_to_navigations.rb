class AddItemTypeToNavigations < ActiveRecord::Migration[8.0]
  def change
    add_column :navigations, :item_type, :string, default: "NAV", null: false
    add_column :navigations, :external_link, :string
    add_column :navigations, :label, :string

    # Set existing records to NAV type
    reversible do |dir|
      dir.up do
        execute "UPDATE navigations SET item_type = 'NAV' WHERE item_type IS NULL"
      end
    end
  end
end
