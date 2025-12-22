class AdminHomeController < ApplicationController
  def index
    data = HomePageData.home_form_data

    render inertia: "Admin/Homepage/Index", props: {
      home_page_data: data
    }
  end

  def update
    home_page_data = HomePageData.instance

    home_page_data.assign_attributes(data: homepage_params)
    home_page_data.save!

    render inertia: "Admin/Homepage/Index", props: {
      home_page_data: home_page_data.home_form_data,
      flash: {
        success: "Homepage data updated successfully."
      }
    }
  rescue ActiveRecord::RecordInvalid
    render inertia: "Admin/Homepage/Index", props: {
      home_page_data: home_page_data.home_form_data,
      home_page_errors: home_page_data.errors.messages,
      flash: {
        error: home_page_data.errors.full_messages
      }
    }
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
