class HomepageController < ApplicationController
  def index
    home_page_data = HomePageData.instance
    render inertia: "Admin/Homepage/Index", props: {
      home_page_data: home_page_data.data
    }
  end

  def update
    home_page_data = HomePageData.instance

    if home_page_data.update(data: homepage_params)
      redirect_to admin_homepage_path, notice: 'Homepage data updated successfully.'
    else
      redirect_to admin_homepage_path, alert: 'Failed to update homepage data.'
    end
  end

  private

  def homepage_params
    params.require(:data).permit!
  end
end
