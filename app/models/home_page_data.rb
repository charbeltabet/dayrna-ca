class HomePageData < ApplicationRecord
  class << self
    def instance
      first_or_create!(data: {})
    end

    def home_form_data
      data = instance.data

      {
        top_ribbon: data["top_ribbon"],
        hero_section: data["hero_section"].merge({
          gallery_group: home_form_hero_section_gallery_group(data["hero_section"])
        }),
        scripture_slides: home_form_scripture_slides(data["scripture_slides"])
      }
    end

    def home_component_data
      data = instance.data

      {
        top_ribbon: data["top_ribbon"],
        hero_section: home_component_hero_section(data["hero_section"]),
        scripture_slides: home_component_scripture_slides(data["scripture_slides"]),
        announcements: home_component_announcements,
        navigations: Navigation.as_nested_tree,
        root_pages: Page.root_pages
      }
    end

    private

    def home_form_scripture_slides(scripture_slides)
      return unless scripture_slides

      scripture_slides.map do |slide|
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

    def home_form_hero_section_gallery_group(hero_section)
      return unless hero_section

      attachment_group = AttachmentsGroup.find_by(id: hero_section["gallery_group_id"])
      return unless attachment_group

      {
        value: attachment_group.id,
        label: attachment_group.title,
        description: attachment_group.description,
        attachment_count: attachment_group.record_attachments.count
      }
    end

    def home_component_scripture_slides(scripture_slides)
      return unless scripture_slides

      scripture_slides.map do |slide|
        slide_data = slide.dup
        if slide["record_attachment_id"].present?
          attachment = RecordAttachment.find_by(id: slide["record_attachment_id"])
          if attachment
            slide_data["attachment"] = {
              id: attachment.id,
              filename: attachment.filename.to_s,
              public_url: attachment.public_url,
              title: attachment.title,
              description: attachment.description
            }
          end
        end
        slide_data
      end
    end

    def home_component_hero_section(hero_section)
      return unless hero_section

      hero_section_data = hero_section.dup
      if hero_section["gallery_group_id"].present?
        group = AttachmentsGroup.find_by(id: hero_section["gallery_group_id"])
        if group
          hero_section_data["gallery_images"] = group.record_attachments.map do |attachment|
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
      hero_section_data
    end

    def home_component_announcements
      Announcement
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
    end
  end
end
