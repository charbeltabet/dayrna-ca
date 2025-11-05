# frozen_string_literal: true

class HomeController < ApplicationController
  def index
    home_page_data = HomePageData.instance
    render inertia: "Home/index", props: {
      homePageData: home_page_data.data
    }
  end
end
