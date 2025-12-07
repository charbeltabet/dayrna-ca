class AdminHomeController < ApplicationController
  def index
    home_page_data = HomePageData.instance
    data = home_page_data.data.deep_dup

    # Enrich scripture slides with attachment data
    if data["scripture_slides"].present?
      data["scripture_slides"] = data["scripture_slides"].map do |slide|
        if slide["record_attachment_id"].present?
          attachment = RecordAttachment.find_by(id: slide["record_attachment_id"])
          if attachment
            slide["attachment"] = {
              id: attachment.id,
              filename: attachment.filename.to_s,
              public_url: attachment.public_url,
              title: attachment.title,
              description: attachment.description
            }
            # Also populate selectedImage for the form
            slide["selectedImage"] = {
              value: attachment.id,
              label: attachment.filename.to_s,
              thumbnail_url: attachment.public_url
            }
          end
        end
        slide
      end
    end

    announcements = Announcement
      .published
      .where(published_at: ..Time.current)
      .order(
        published_at: :desc,
        id: :desc,
      ).as_json(
        methods: [
          :image_url,
          :text_preview
        ]
      )
    data["announcements"] = announcements

    data["navigations"] = Navigation.as_nested_tree
    data["root_pages"] = Page.root_pages

    meta, attachments = paginate(RecordAttachment.order(created_at: :desc))

    attachment_groups = AttachmentsGroup.all
    attachment_groups_data = attachment_groups.map do |group|
      group.as_json.merge(
        recent_attachments: group.record_attachments
          .where("record_attachments.created_at IS NOT NULL")
          .order(created_at: :desc)
          .limit(10)
          .as_json(methods: [ :public_url ])
      )
    end

    render inertia: "Admin/Homepage/Index", props: {
      home_page_data: data,
      attachments: InertiaRails.scroll(meta, wrapper: "data") {
        {
          data: attachments.as_json(methods: [ :public_url ]),
          meta: meta
        }
      },
      attachment_groups: attachment_groups_data
    }
  end

  def update
    home_page_data = HomePageData.instance

    if home_page_data.update(data: homepage_params)
      redirect_to admin_home_path, notice: "Homepage data updated successfully."
    else
      redirect_to admin_home_path, alert: "Failed to update homepage data."
    end
  end

  private

  def homepage_params
    params.require(:data).permit!
  end
end
