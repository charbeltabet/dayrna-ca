class Page < ApplicationRecord
  belongs_to :navigation

  before_validation :generate_slug

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: { scope: :navigation_id }
  validates :slug, format: { with: /\A[a-z0-9\-]+\z/, message: "only allows lowercase letters, numbers, and hyphens" }

  class << self
    def root_pages
      Page.where(navigation_id: nil).as_json(methods: [ :full_path, :image_url, :text_preview ])
    end
  end

  def image_url
    md = Kramdown::Document.new(content || "")
    find_image(md.root)
  end

  def text_preview
    plain_text = ActionView::Base.full_sanitizer.sanitize(Kramdown::Document.new(content || "").to_html)
    plain_text.truncate(200)
  end

  def full_path
    slugs = []
    current_nav = navigation

    # Collect all parent navigation slugs
    while current_nav
      slugs.unshift(current_nav.url) if current_nav.url.present?
      current_nav = current_nav.parent
    end

    # Add page slug at the end
    slugs << slug

    # Join with slashes and prepend /reference
    "/reference/" + slugs.join("/")
  end

  private

  def generate_slug
    return if title.blank?

    # Generate base slug from title
    base_slug = title.downcase
                     .strip
                     .gsub(/[^a-z0-9\s-]/, "") # Remove special characters
                     .gsub(/\s+/, "-")          # Replace spaces with dashes
                     .gsub(/-+/, "-")           # Replace multiple dashes with single dash
                     .gsub(/^-|-$/, "")         # Remove leading/trailing dashes

    # Find siblings (same navigation)
    siblings = Page.where(navigation_id: navigation_id)
    siblings = siblings.where.not(id: id) if persisted?

    # Check if base slug is unique among siblings
    if siblings.where(slug: base_slug).exists?
      # Find the next available number
      counter = 2
      loop do
        candidate_slug = "#{base_slug}-#{counter}"
        break self.slug = candidate_slug unless siblings.where(slug: candidate_slug).exists?
        counter += 1
      end
    else
      self.slug = base_slug
    end
  end

  def find_image(element)
    return element.attr["src"] if element.type == :img

    element.children.each do |child|
      result = find_image(child)
      return result if result
    end

    nil
  end
end
