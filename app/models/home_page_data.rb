class HomePageData < ApplicationRecord
  # Helper method to get the singleton instance
  def self.instance
    first_or_create!(data: {})
  end

  # Helper method to update the singleton instance
  def self.update_data(new_data)
    instance.update!(data: new_data)
  end
end
