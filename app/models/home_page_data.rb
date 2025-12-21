class HomePageData < ApplicationRecord
  class << self
    def instance
      first_or_create!(data: {})
    end

    def update_data(new_data)
      instance.update!(data: new_data)
    end

    def home_form_data
      data = instance.data.deep_dup

      if data["scripture_slides"].present?
        data["scripture_slides"] = data["scripture_slides"].map do |slide|
          if slide["record_attachment_id"].present?
            attachment = RecordAttachment.find_by(id: slide["record_attachment_id"])
            if attachment
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

      # Enrich hero section with gallery_group for the form
      if data["hero_section"].present? && data["hero_section"]["gallery_group_id"].present?
        group = AttachmentsGroup.find_by(id: data["hero_section"]["gallery_group_id"])
        if group
          data["hero_section"]["gallery_group"] = {
            value: group.id,
            label: group.title,
            description: group.description,
            attachment_count: group.record_attachments.count
          }
        end
      end

      data
    end

    def home_component_data
      data = instance.data.deep_dup

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

      data
    end
  end
end
