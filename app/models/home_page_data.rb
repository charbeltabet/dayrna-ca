class HomePageData < ApplicationRecord
  class << self
    def instance
      first_or_create!(data: {})
    end
  end

  validates :top_ribbon, presence: true
  validate :validate_top_ribbon
  validate :validate_hero_section
  validate :validate_scripture_slides

  def top_ribbon
    data["top_ribbon"]
  end

  def hero_section
    data["hero_section"]
  end

  def scripture_slides
    data["scripture_slides"]
  end

  def phone
    top_ribbon["phone"]
  end

  def home_form_data
    {
      top_ribbon: data["top_ribbon"],
      hero_section: data["hero_section"].merge({
        gallery_group: home_form_hero_section_gallery_group(data["hero_section"])
      }),
      scripture_slides: home_form_scripture_slides(data["scripture_slides"])
    }
  end

  def home_component_data
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

  def validate_top_ribbon
    return unless top_ribbon.is_a?(Hash)

    if top_ribbon["phone"].present? && top_ribbon["phone"].length > 20
      errors.add(:"top_ribbon.phone", "is too long (maximum is 20 characters)")
    end

    if top_ribbon["email"].present? && top_ribbon["email"].length > 100
      errors.add(:"top_ribbon.email", "is too long (maximum is 100 characters)")
    end

    if top_ribbon["address"].present? && top_ribbon["address"].length > 200
      errors.add(:"top_ribbon.address", "is too long (maximum is 200 characters)")
    end

    if top_ribbon["youtube_url"].present? && top_ribbon["youtube_url"].length > 255
      errors.add(:"top_ribbon.youtube_url", "is too long (maximum is 255 characters)")
    end

    if top_ribbon["facebook_url"].present? && top_ribbon["facebook_url"].length > 255
      errors.add(:"top_ribbon.facebook_url", "is too long (maximum is 255 characters)")
    end
  end

  def validate_hero_section
    return unless hero_section.is_a?(Hash)

    if hero_section["subtitle"].present? && hero_section["subtitle"].length > 100
      errors.add(:"hero_section.subtitle", "is too long (maximum is 100 characters)")
    end

    if hero_section["heading"].present? && hero_section["heading"].length > 200
      errors.add(:"hero_section.heading", "is too long (maximum is 200 characters)")
    end

    if hero_section["description"].present? && hero_section["description"].length > 1000
      errors.add(:"hero_section.description", "is too long (maximum is 1000 characters)")
    end

    if hero_section["button_text"].present? && hero_section["button_text"].length > 50
      errors.add(:"hero_section.button_text", "is too long (maximum is 50 characters)")
    end

    if hero_section["button_link"].present? && hero_section["button_link"].length > 255
      errors.add(:"hero_section.button_link", "is too long (maximum is 255 characters)")
    end

    if hero_section["sanctuary_hours"].present? && hero_section["sanctuary_hours"].length > 200
      errors.add(:"hero_section.sanctuary_hours", "is too long (maximum is 200 characters)")
    end

    validate_mass_schedule(hero_section["mass_schedule"])
  end

  def validate_mass_schedule(mass_schedule)
    return unless mass_schedule.is_a?(Hash)

    if mass_schedule["weekday"].present? && mass_schedule["weekday"].length > 100
      errors.add(:"hero_section.mass_schedule.weekday", "is too long (maximum is 100 characters)")
    end

    if mass_schedule["sunday"].present? && mass_schedule["sunday"].length > 100
      errors.add(:"hero_section.mass_schedule.sunday", "is too long (maximum is 100 characters)")
    end
  end

  def validate_scripture_slides
    return unless scripture_slides.is_a?(Array)

    if scripture_slides.length > 10
      errors.add(:scripture_slides, "cannot have more than 10 slides")
    end

    scripture_slides.each_with_index do |slide, index|
      next unless slide.is_a?(Hash)

      if slide["scripture_text"].present? && slide["scripture_text"].length > 500
        errors.add(:"scripture_slides[#{index}].scripture_text", "is too long (maximum is 500 characters)")
      end

      if slide["reference"].present? && slide["reference"].length > 100
        errors.add(:"scripture_slides[#{index}].reference", "is too long (maximum is 100 characters)")
      end
    end
  end

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
