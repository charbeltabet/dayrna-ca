class AdminHomeController < ApplicationController
  def index
    data = HomePageData.instance.home_form_data

    render inertia: "Admin/Homepage/Index", props: {
      home_page_data: data
    }
  end

  def update
    home_page_data = HomePageData.instance

    home_page_data.assign_attributes(data: homepage_params)
    home_page_data.save!

    redirect_to admin_home_path, flash: { success: "Homepage data updated successfully." }
  end

  private

  def homepage_params
    params.require(:home_page).permit(
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
