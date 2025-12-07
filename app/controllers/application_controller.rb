class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  inertia_share do
    # Get home page data for the navigation bar
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
          end
        end
        slide
      end
    end

    # Enrich hero section with gallery images from attachment group
    if data["hero_section"].present? && data["hero_section"]["gallery_group_id"].present?
      group = AttachmentsGroup.find_by(id: data["hero_section"]["gallery_group_id"])
      if group
        data["hero_section"]["gallery_images"] = group.record_attachments.map do |attachment|
          {
            id: attachment.id,
            filename: attachment.filename.to_s,
            public_url: attachment.public_url,
            title: attachment.title,
            description: attachment.description
          }
        end
      end
    end


    data["navigations"] = Navigation.as_nested_tree
    data["root_pages"] = Page.root_pages

    {
      flash: flash.to_hash,
      homePageData: data
    }
  end

  PER_PAGE = 20

  def paginate(scope, page_param: :page)
    page = [ params.fetch(page_param, 1).to_i, 1 ].max

    records = scope.offset((page - 1) * PER_PAGE).limit(PER_PAGE + 1)

    meta = {
      page_name: page_param.to_s,
      previous_page: page > 1 ? page - 1 : nil,
      next_page: records.length > PER_PAGE ? page + 1 : nil,
      current_page: page,
      total_count: scope.count
    }

    [ meta, records.first(PER_PAGE) ]
  end
end
