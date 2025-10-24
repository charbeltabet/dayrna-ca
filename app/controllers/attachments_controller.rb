class AttachmentsController < ApplicationController
  def index
    render inertia: "Admin/Attachments/Index", props: {
      attachments: -> {
        records = RecordAttachment.order(created_at: :desc)

        # Apply search filter if query parameter is present
        if params[:query].present?
          query = params[:query].strip
          records = records.joins(file_attachment: :blob).where(
            "title LIKE ? OR description LIKE ? OR active_storage_blobs.filename LIKE ?",
            "%#{query}%",
            "%#{query}%",
            "%#{query}%"
          )
        end

        {
          data: records.map do |record|
            {
              id: record.id,
              filename: record.filename.to_s,
              url: record.file.attached? ? record.file.url : nil,
              human_readable_size: record.human_readable_size,
              byte_size: record.byte_size,
              title: record.title,
              description: record.description,
              created_at: record.created_at.strftime("%Y-%m-%d %H:%M"),
              updated_at: record.updated_at.strftime("%Y-%m-%d %H:%M")
            }
          end,
          count: records.count,
          byte_size: records.human_readable_total_size
        }
      },
      query: params[:query],
      previewed_attachment: -> {
        if params[:id].present?
          record = RecordAttachment.find_by(id: params[:id])
          return if record.nil?

          {
            id: record.id,
            filename: record.filename.to_s,
            url: record.file.attached? ? record.file.url : nil,
            human_readable_size: record.human_readable_size,
            byte_size: record.byte_size,
            title: record.title,
            description: record.description,
            created_at: record.created_at.strftime("%Y-%m-%d %H:%M"),
            updated_at: record.updated_at.strftime("%Y-%m-%d %H:%M")
          }
        else
          nil
        end
      }
    }
  end

  def create
    attachments_params = params[:attachments]
    uploaded_records = []

    attachments_params.each do |index, attachment_data|
      file = attachment_data[:file]
      filename = attachment_data[:filename]
      title = attachment_data[:title]
      description = attachment_data[:description]

      sanitized_filename = sanitize_filename(filename.presence || file.original_filename)

      record = RecordAttachment.new(
        title: title,
        description: description
      )

      attach_file_to_record(record, file, sanitized_filename)

      record.save!
      uploaded_records << record
      Rails.logger.info "  Uploaded attachment ID: #{record.id}"
    end

    last_id = uploaded_records.last.id
    redirect_to "/admin/attachments/#{last_id}", flash: { success: "#{uploaded_records.count} attachment(s) uploaded successfully." }
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error "Validation error uploading attachments: #{e.message}"
    redirect_to "/admin/attachments", flash: { error: e.message }
  rescue => e
    Rails.logger.error "Error uploading attachments: #{e.message}"
    redirect_to "/admin/attachments", flash: { error: "Failed to upload attachments: #{e.message}" }
  end

  def update
    record = RecordAttachment.find(params[:id])

    update_params = params.permit(:title, :description).to_h.compact
    record.update!(update_params) if update_params.any?

    if params[:file].present?
      file = params[:file]
      sanitized_filename = sanitize_filename(params[:filename].presence || file.original_filename)

      attach_file_to_record(record, file, sanitized_filename)
      record.save!
    elsif params[:filename].present?
      sanitized_filename = sanitize_filename(params[:filename])
      record.file.blob.update!(filename: sanitized_filename) if record.file.attached?
    end

    redirect_to "/admin/attachments/#{record.id}", flash: { success: "Attachment #{record.filename} updated successfully." }
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error "Validation error updating attachment: #{e.message}"
    redirect_to "/admin/attachments/#{params[:id]}", flash: { error: e.message }
  rescue => e
    Rails.logger.error "Error updating attachment: #{e.message}"
    redirect_to "/admin/attachments/#{params[:id]}", flash: { error: "Failed to update attachment: #{e.message}" }
  end

  def destroy
    # Handle both single ID and array of IDs
    ids = params[:id].is_a?(Array) ? params[:id] : [ params[:id] ]

    records = RecordAttachment.where(id: ids)
    count = records.count

    if count == 0
      redirect_to "/admin/attachments", flash: { error: "No attachments found to delete." }
      return
    end

    # For single delete, show filename in message
    if count == 1
      filename = records.first.filename
      records.destroy_all
      redirect_to "/admin/attachments", flash: { success: "Attachment #{filename} deleted successfully." }
    else
      records.destroy_all
      redirect_to "/admin/attachments", flash: { success: "#{count} attachment(s) deleted successfully." }
    end
  rescue => e
    Rails.logger.error "Error deleting attachment(s): #{e.message}"
    redirect_to "/admin/attachments", flash: { error: "Failed to delete attachment(s): #{e.message}" }
  end

  def groups
    render inertia: "Admin/AttachmentGroups/Index", props: {
      attachment_groups: -> {
        AttachmentsGroup.order(created_at: :desc).map do |group|
          {
            id: group.id,
            title: group.title,
            description: group.description,
            created_at: group.created_at.strftime("%Y-%m-%d %H:%M"),
            updated_at: group.updated_at.strftime("%Y-%m-%d %H:%M")
          }
        end
      }
    }
  end

  private

  def sanitize_filename(filename)
    filename.to_s.gsub(" ", "_")
  end

  def attach_file_to_record(record, uploaded_file, filename)
    record.file.attach(
      io: uploaded_file.tempfile,
      filename: filename,
      content_type: uploaded_file.content_type
    )
  end
end
