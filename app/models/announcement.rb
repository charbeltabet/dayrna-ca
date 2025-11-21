class Announcement < ApplicationRecord
  scope :published, -> { where("published_at <= ?", Time.current) }

  def image_url
    md = Kramdown::Document.new(content || "")
    find_image(md.root)
  end

  def text_preview
    plain_text = ActionView::Base.full_sanitizer.sanitize(Kramdown::Document.new(content || "").to_html)
    plain_text.truncate(200)
  end

  private

  def find_image(element)
    return element.attr["src"] if element.type == :img

    element.children.each do |child|
      result = find_image(child)
      return result if result
    end

    nil
  end
end
