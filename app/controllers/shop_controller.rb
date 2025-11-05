class ShopController < ApplicationController
  def label
    render inertia: "Admin/Shop/Label/index"
  end
end
