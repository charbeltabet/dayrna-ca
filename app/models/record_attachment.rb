class RecordAttachment < ApplicationRecord
  has_one_attached :file

  validates :title, presence: false, length: { maximum: 200 }
  validates :description, length: { maximum: 1000 }
  validate :acceptable_file

  before_save :cache_file_metadata

  class RecordAttachmentRelation < ActiveRecord::Relation
    def total_byte_size
      # Sum byte_size from all blobs in the collection
      sum { |record| record.cached_file_size.to_i }
    end

    def human_readable_total_size
      ActiveSupport::NumberHelper.number_to_human_size(total_byte_size)
    end
  end

  def self.relation
    RecordAttachmentRelation.new(self)
  end

  def byte_size
    file.blob&.byte_size if file.attached?
  end

  def content_type
    file.blob&.content_type if file.attached?
  end

  def filename
    file.blob&.filename if file.attached?
  end

  def human_readable_size
    ActiveSupport::NumberHelper.number_to_human_size(byte_size) if byte_size
  end

  def image?
    content_type&.start_with?("image/")
  end

  def thumbnail_url(variant: { resize_to_limit: [ 300, 300 ] })
    return nil unless image? && file.attached?

    Rails.cache.fetch(thumbnail_cache_key(variant), expires_in: 2.hours) do
      file.variant(variant).processed.url(expires_in: 2.hours)
    end
  end

  private

  def acceptable_file
    return unless file.attached?

    errors.add(:file, "is too large") if byte_size && byte_size > 10.megabytes
    errors.add(:file, "must be a PDF or image") unless acceptable_type?
  end

  def acceptable_type?
    content_type&.in?(%w[application/pdf image/jpeg image/png])
  end

  def cache_file_metadata
    self.cached_file_size = byte_size if file.attached?
  end

  def thumbnail_cache_key(variant)
    variant_key = variant.sort.to_s.gsub(/[^a-z0-9]/i, "_")
    "document/#{id}/thumbnail/#{variant_key}/#{updated_at.to_i}"
  end
end
