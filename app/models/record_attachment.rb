class RecordAttachment < ApplicationRecord
  class << self
    def create_from_file(file)
      title = file.original_filename
      record_attachment = RecordAttachment.new(title: title)
      record_attachment.save!(validate: false)
      record_attachment.attach_file(file)
      record_attachment.save!
      record_attachment
    end
  end
  include Fetchable

  has_one_attached :file
  has_many :attachment_group_memberships, dependent: :destroy
  has_many :attachments_groups, through: :attachment_group_memberships

  validates :title, presence: false, length: { maximum: 200 }
  validates :description, length: { maximum: 1000 }
  validate :acceptable_file

  before_save :cache_file_metadata

  scope :total_byte_size, -> {
    sum { |record| record.cached_file_size.to_i }
  }

  scope :human_readable_total_size, -> {
    ActiveSupport::NumberHelper.number_to_human_size(total_byte_size)
  }

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

    # Rails.cache.fetch(thumbnail_cache_key(variant), expires_in: 2.hours) do
    file.variant(variant).processed.url(expires_in: 2.hours)
    # end
  end

  def public_url
    return nil unless file.attached?

    # Get the public URL from the storage service
    service = file.blob.service

    # For S3-compatible services (like Cloudflare R2), construct the public URL
    if service.is_a?(ActiveStorage::Service::S3Service)
      key = file.blob.key

      # Try to get public URL from credentials, otherwise construct from endpoint
      base_url = Rails.application.credentials.dig(:cloudflare, :public_url)

      if base_url.blank?
        # Extract base URL from endpoint (remove API path if present)
        endpoint = Rails.application.credentials.dig(:cloudflare, :public_endpoint)
        # For R2, the public URL format is typically: https://pub-{hash}.r2.dev
        # or the endpoint with the bucket name
        # Since we don't have the public URL configured, we'll use the endpoint
        base_url = endpoint&.gsub(/\/$/, "") # Remove trailing slash
      end

      "#{base_url}/#{key}"
    else
      # Fallback for other storage types (Disk, etc.)
      file.url
    end
  end

  def attach_file(file)
    filename = file.original_filename
    custom_key = "attachments/#{self.id}/#{filename}"

    self.file.purge
    self.file.attach(
      io: file.tempfile,
      filename: filename,
      content_type: file.content_type,
      key: custom_key
    )
  end

  def associate_to_attachment_groups(ids)
    if ids
      current_group_ids = self.attachments_group_ids
      return if current_group_ids.sort == ids.sort

      self.attachment_group_memberships.destroy_all

      ids.each do |group_id|
        AttachmentGroupMembership.create!(
          record_attachment_id: self.id,
          attachments_group_id: group_id
        )
      end
    elsif ids == []
      self.attachment_group_memberships.destroy_all
    end
  end

  private

  def byte_size
    file.blob&.byte_size if file.attached?
  end

  def acceptable_file
    return unless file.attached?

    errors.add(:file, "is too large") if byte_size && byte_size > 10.megabytes
    errors.add(:file, "must be a PDF or image") unless acceptable_type?
  end

  def acceptable_type?
    content_type&.in?(
      [ "image/*", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ]
    )
  end

  def cache_file_metadata
    self.cached_file_size = byte_size if file.attached?
  end

  def thumbnail_cache_key(variant)
    variant_key = variant.sort.to_s.gsub(/[^a-z0-9]/i, "_")
    "document/#{id}/thumbnail/#{variant_key}/#{updated_at.to_i}"
  end
end
