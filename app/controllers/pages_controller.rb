class PagesController < ApplicationController
  def our_lady_icon
    render inertia: "Pages/OurLadyIcon/index"
  end
end
