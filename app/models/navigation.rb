# frozen_string_literal: true

class Navigation < ApplicationRecord
  belongs_to :parent, class_name: "Navigation", foreign_key: "navigation_parent_id", optional: true
  has_many :children, class_name: "Navigation", foreign_key: "navigation_parent_id", dependent: :destroy
  has_many :pages, dependent: :destroy

  scope :roots, -> { where(navigation_parent_id: nil).order(:position) }

  # Item type validations
  ITEM_TYPES = %w[NAV PAGE MENU].freeze
  validates :item_type, inclusion: { in: ITEM_TYPES }

  before_validation :generate_slug
  validates :url, uniqueness: { scope: :navigation_parent_id, message: "must be unique among siblings" }

  def self.as_nested_tree
    roots.map do |root|
      root.as_tree
    end
  end

  def as_tree
    {
      id: id,
      name: name,
      url: url,
      position: position,
      navigation_parent_id: navigation_parent_id,
      item_type: item_type,
      external_link: external_link,
      label: label,
      children: children.order(:position).map(&:as_tree),
      pages: pages.order(:position).as_json(methods: [ :full_path, :image_url, :text_preview ]),
      full_path: full_path
    }
  end

  def full_path
    return external_link if external_link.present?

    slugs = []
    current_nav = self

    # Collect all parent navigation slugs
    while current_nav
      slugs.unshift(current_nav.url) if current_nav.url.present?
      current_nav = current_nav.parent
    end

    # Join with slashes and prepend /reference
    "/reference/" + slugs.join("/")
  end

  private

  def generate_slug
    return if name.blank?

    # Generate base slug from name
    base_slug = name.downcase
                    .strip
                    .gsub(/[^a-z0-9\s-]/, "") # Remove special characters
                    .gsub(/\s+/, "-")          # Replace spaces with dashes
                    .gsub(/-+/, "-")           # Replace multiple dashes with single dash
                    .gsub(/^-|-$/, "")         # Remove leading/trailing dashes

    # Find siblings (same parent)
    siblings = Navigation.where(navigation_parent_id: navigation_parent_id)
    siblings = siblings.where.not(id: id) if persisted?

    # Check if base slug is unique among siblings
    if siblings.where(url: base_slug).exists?
      # Find the next available number
      counter = 2
      loop do
        candidate_slug = "#{base_slug}-#{counter}"
        break self.url = candidate_slug unless siblings.where(url: candidate_slug).exists?
        counter += 1
      end
    else
      self.url = base_slug
    end
  end
end
