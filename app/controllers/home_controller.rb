# frozen_string_literal: true

class HomeController < ApplicationController
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

    render inertia: "Home/index", props: {
      homePageData: data,
      attachments: InertiaRails.scroll(meta, wrapper: "data") {
        {
          data: attachments.as_json(methods: [ :public_url ]),
          meta: meta
        }
      },
      attachment_groups: attachment_groups_data
    }
  end

  private

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
