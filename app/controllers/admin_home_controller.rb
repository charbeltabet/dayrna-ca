class AdminHomeController < ApplicationController
  def index
    data = HomePageData.home_form_data

    render inertia: "Admin/Homepage/Index", props: {
      home_page_data: data
    }
  end

  def update
    home_page_data = HomePageData.instance

    if home_page_data.update(data: homepage_params)
      redirect_to admin_home_path, flash: {
        success: "Homepage data updated successfully."
      }
    else
      redirect_to admin_home_path, flash: {
        error: "Failed to update homepage data."
      }
    end
  end

  private

  def homepage_params
    params.require(:homepage).permit(
      top_ribbon: [
        :address,
        :phone,
        :email,
        :youtube_url,
        :facebook_url
      ],
      scripture_slides: [
        :scripture_text,
        :reference,
        :record_attachment_id
      ],
      hero_section: [
        :subtitle,
        :heading,
        :description,
        :button_text,
        :button_link,
        :gallery_group_id,
        :sanctuary_hours,
        { mass_schedule: [ :weekday, :sunday ] }
      ]
    )
  end
end
