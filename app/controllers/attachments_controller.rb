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
              url: record.public_url,
              human_readable_size: record.human_readable_size,
              title: record.title,
              description: record.description,
              created_at: record.created_at.strftime("%Y-%m-%d %H:%M"),
              updated_at: record.updated_at.strftime("%Y-%m-%d %H:%M"),
              groups: record.attachments_groups.map { |group| { id: group.id, name: group.title } }
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
            url: record.public_url,
            human_readable_size: record.human_readable_size,
            title: record.title,
            description: record.description,
            created_at: record.created_at.strftime("%Y-%m-%d %H:%M"),
            updated_at: record.updated_at.strftime("%Y-%m-%d %H:%M"),
            groups: record.attachments_groups.map { |group| { id: group.id, name: group.title } }
          }
        else
          nil
        end
      },
      all_groups: -> {
        AttachmentsGroup.order(:title).map { |group| { id: group.id, title: group.title } }
      }
    }
  end

  def create
    attachments_params = params[:attachments]
    group_id = params[:group_id]
    uploaded_records = []

    attachments_params.each do |index, attachment_data|
      file = attachment_data[:file]
      filename = attachment_data[:filename]
      title = attachment_data[:title]
      description = attachment_data[:description]
      group_ids = attachment_data[:group_ids] # Get group_ids from attachment data

      sanitized_filename = sanitize_filename(filename.presence || file.original_filename)

      record = RecordAttachment.new(
        title: title,
        description: description
      )

      # Save record first to get an ID for the custom key
      record.save!

      # Now attach the file with custom key using the record's ID
      attach_file_to_record(record, file, sanitized_filename)
      record.save! # Save again to persist the attachment

      uploaded_records << record
      Rails.logger.info "  Uploaded attachment ID: #{record.id}"

      # If group_id is provided (from group upload context), associate with the group
      if group_id.present?
        AttachmentGroupMembership.find_or_create_by(
          record_attachment_id: record.id,
          attachments_group_id: group_id
        )
      end

      # If group_ids are provided (from individual attachment form), associate with those groups
      if group_ids.present?
        # Handle both array and hash formats (FormData can send as hash with numeric keys)
        group_ids_array = if group_ids.is_a?(Hash)
          group_ids.values
        elsif group_ids.is_a?(Array)
          group_ids
        else
          [ group_ids ]
        end

        group_ids_array.each do |gid|
          next if gid.blank?
          # Verify the group exists before creating membership
          if AttachmentsGroup.exists?(gid)
            AttachmentGroupMembership.find_or_create_by(
              record_attachment_id: record.id,
              attachments_group_id: gid
            )
          else
            Rails.logger.warn "Attempted to associate with non-existent group: #{gid}"
          end
        end
      end
    end

    last_id = uploaded_records.last.id

    # Redirect based on whether we're uploading to a group or standalone
    if group_id.present?
      redirect_to "/admin/attachments/groups/#{group_id}", flash: { success: "#{uploaded_records.count} attachment(s) uploaded and associated with group." }
    else
      redirect_to "/admin/attachments/#{last_id}", flash: { success: "#{uploaded_records.count} attachment(s) uploaded successfully." }
    end
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error "Validation error uploading attachments: #{e.message}"
    redirect_path = group_id.present? ? "/admin/attachments/groups/#{group_id}" : "/admin/attachments"
    redirect_to redirect_path, flash: { error: e.message }
  rescue => e
    Rails.logger.error "Error uploading attachments: #{e.message}"
    redirect_path = group_id.present? ? "/admin/attachments/groups/#{group_id}" : "/admin/attachments"
    redirect_to redirect_path, flash: { error: "Failed to upload attachments: #{e.message}" }
  end

  def update
    record = RecordAttachment.find(params[:id])

    update_params = params.permit(:title, :description).to_h.compact
    record.update!(update_params) if update_params.any?

    if params[:file].present?
      file = params[:file]
      sanitized_filename = sanitize_filename(params[:filename].presence || file.original_filename)

      # Purge old attachment before attaching new one to avoid duplicate key constraint
      if record.file.attached?
        record.file.purge
      end

      attach_file_to_record(record, file, sanitized_filename)
      record.save!
    elsif params[:filename].present?
      sanitized_filename = sanitize_filename(params[:filename])
      record.file.blob.update!(filename: sanitized_filename) if record.file.attached?
    end

    group_ids = params[:group_ids]&.values

    if group_ids
      group_ids = group_ids.reject(&:blank?)

      record.attachment_group_memberships.destroy_all

      group_ids.each do |group_id|
        # Verify the group exists before creating membership
        if AttachmentsGroup.exists?(group_id)
          AttachmentGroupMembership.create!(
            record_attachment_id: record.id,
            attachments_group_id: group_id
          )
        else
          Rails.logger.warn "Attempted to associate with non-existent group: #{group_id}"
        end
      end
    else
      record.attachment_group_memberships.destroy_all
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
    # Handle IDs from either URL path (:id) or request body (:ids)
    ids = if params[:ids].present?
      # Bulk delete via request body
      params[:ids].is_a?(Array) ? params[:ids] : [ params[:ids] ]
    elsif params[:id].present?
      # Single delete via URL path
      params[:id].is_a?(Array) ? params[:id] : [ params[:id] ]
    else
      []
    end

    if ids.empty?
      redirect_to "/admin/attachments", flash: { error: "No attachments specified for deletion." }
      return
    end

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

  def groups_json
    # Simple JSON endpoint for fetching all groups (for autocomplete)
    groups = AttachmentsGroup.order(:title).map do |group|
      { id: group.id, title: group.title }
    end
    render json: groups
  end

  def groups
    render inertia: "Admin/AttachmentGroups/Index", props: {
      attachment_groups: -> {
        records = AttachmentsGroup.order(created_at: :desc)

        # Apply search filter if query parameter is present
        if params[:query].present?
          query = params[:query].strip
          records = records.where(
            "title LIKE ? OR description LIKE ?",
            "%#{query}%",
            "%#{query}%"
          )
        end

        {
          data: records.map do |group|
            {
              id: group.id,
              title: group.title,
              description: group.description,
              created_at: group.created_at.strftime("%Y-%m-%d %H:%M"),
              updated_at: group.updated_at.strftime("%Y-%m-%d %H:%M"),
              attachment_count: group.record_attachments.count
            }
          end,
          count: records.count
        }
      },
      query: params[:query],
      attachments_query: params[:attachments_query],
      previewed_group: -> {
        if params[:id].present?
          group = AttachmentsGroup.find_by(id: params[:id])
          return if group.nil?

          # Get all attachments with search and sorting
          attachments_records = RecordAttachment.all

          # Apply search filter if attachments_query parameter is present
          if params[:attachments_query].present?
            query = params[:attachments_query].strip
            # Search by filename (blob filename), title, and description
            # Need to join through active_storage_attachments to get to blobs
            attachments_records = attachments_records
              .joins("LEFT JOIN active_storage_attachments ON active_storage_attachments.record_id = record_attachments.id AND active_storage_attachments.record_type = 'RecordAttachment' AND active_storage_attachments.name = 'file'")
              .joins("LEFT JOIN active_storage_blobs ON active_storage_blobs.id = active_storage_attachments.blob_id")
              .where(
                "COALESCE(active_storage_blobs.filename, '') LIKE ? OR COALESCE(record_attachments.title, '') LIKE ? OR COALESCE(record_attachments.description, '') LIKE ?",
                "%#{query}%",
                "%#{query}%",
                "%#{query}%"
              )
          end

          # Join with memberships to determine if attachment is in this group
          # Sort: group members first, then by created_at DESC
          all_attachments = attachments_records
            .joins("LEFT JOIN attachment_group_memberships ON attachment_group_memberships.record_attachment_id = record_attachments.id AND attachment_group_memberships.attachments_group_id = #{group.id}")
            .select("record_attachments.*, attachment_group_memberships.id AS membership_id")
            .order(
              Arel.sql("CASE WHEN attachment_group_memberships.id IS NOT NULL THEN 0 ELSE 1 END, record_attachments.created_at DESC")
            ).map do |attachment|
            {
              id: attachment.id,
              filename: attachment.file.attached? ? attachment.file.filename.to_s : "",
              title: attachment.title,
              description: attachment.description,
              human_readable_size: attachment.human_readable_size,
              url: attachment.public_url,
              created_at: attachment.created_at.strftime("%Y-%m-%d %H:%M"),
              updated_at: attachment.updated_at.strftime("%Y-%m-%d %H:%M"),
              in_group: attachment.membership_id.present?
            }
          end

          {
            id: group.id,
            title: group.title,
            description: group.description,
            created_at: group.created_at.strftime("%Y-%m-%d %H:%M"),
            updated_at: group.updated_at.strftime("%Y-%m-%d %H:%M"),
            attachments: {
              data: all_attachments,
              count: all_attachments.count
            }
          }
        else
          nil
        end
      }
    }
  end

  def create_group
    group = AttachmentsGroup.new(
      title: params[:title],
      description: params[:description]
    )

    group.save!
    redirect_to "/admin/attachments/groups/#{group.id}", flash: { success: "Group '#{group.title}' created successfully." }
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error "Validation error creating group: #{e.message}"
    redirect_to "/admin/attachments/groups", flash: { error: e.message }
  rescue => e
    Rails.logger.error "Error creating group: #{e.message}"
    redirect_to "/admin/attachments/groups", flash: { error: "Failed to create group: #{e.message}" }
  end

  def update_group
    group = AttachmentsGroup.find(params[:id])

    update_params = params.permit(:title, :description).to_h.compact
    group.update!(update_params) if update_params.any?

    redirect_to "/admin/attachments/groups/#{group.id}", flash: { success: "Group '#{group.title}' updated successfully." }
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error "Validation error updating group: #{e.message}"
    redirect_to "/admin/attachments/groups/#{params[:id]}", flash: { error: e.message }
  rescue => e
    Rails.logger.error "Error updating group: #{e.message}"
    redirect_to "/admin/attachments/groups/#{params[:id]}", flash: { error: "Failed to update group: #{e.message}" }
  end

  def destroy_group
    # Handle both single ID and array of IDs
    ids = params[:id].is_a?(Array) ? params[:id] : [ params[:id] ]

    groups = AttachmentsGroup.where(id: ids)
    count = groups.count

    if count == 0
      redirect_to "/admin/attachments/groups", flash: { error: "No groups found to delete." }
      return
    end

    # For single delete, show title in message
    if count == 1
      title = groups.first.title
      groups.destroy_all
      redirect_to "/admin/attachments/groups", flash: { success: "Group '#{title}' deleted successfully." }
    else
      groups.destroy_all
      redirect_to "/admin/attachments/groups", flash: { success: "#{count} group(s) deleted successfully." }
    end
  rescue => e
    Rails.logger.error "Error deleting group(s): #{e.message}"
    redirect_to "/admin/attachments/groups", flash: { error: "Failed to delete group(s): #{e.message}" }
  end

  def associate_to_group
    group = AttachmentsGroup.find(params[:id])

    # Handle both single attachment_id and array of attachment_ids
    attachment_ids = params[:attachment_ids].is_a?(Array) ? params[:attachment_ids] : [ params[:attachment_ids] ]

    attachments = RecordAttachment.where(id: attachment_ids)
    count = attachments.count

    if count == 0
      redirect_to "/admin/attachments/groups/#{group.id}", flash: { error: "No attachments found to associate." }
      return
    end

    # Create memberships for attachments not already in the group
    created_count = 0
    attachments.each do |attachment|
      membership = AttachmentGroupMembership.find_or_create_by(
        record_attachment_id: attachment.id,
        attachments_group_id: group.id
      )
      created_count += 1 if membership.previously_new_record?
    end

    message = created_count == 1 ? "1 attachment associated to '#{group.title}'." : "#{created_count} attachment(s) associated to '#{group.title}'."
    redirect_to "/admin/attachments/groups/#{group.id}", flash: { success: message }
  rescue => e
    Rails.logger.error "Error associating attachment(s): #{e.message}"
    redirect_to "/admin/attachments/groups/#{params[:id]}", flash: { error: "Failed to associate attachment(s): #{e.message}" }
  end

  def disassociate_from_group
    group = AttachmentsGroup.find(params[:id])

    # Handle both single attachment_id and array of attachment_ids
    attachment_ids = params[:attachment_ids].is_a?(Array) ? params[:attachment_ids] : [ params[:attachment_ids] ]

    # Find and destroy memberships for this group and these attachments
    memberships = AttachmentGroupMembership.where(
      record_attachment_id: attachment_ids,
      attachments_group_id: group.id
    )
    count = memberships.count

    if count == 0
      redirect_to "/admin/attachments/groups/#{group.id}", flash: { error: "No attachments found to disassociate from this group." }
      return
    end

    memberships.destroy_all

    message = count == 1 ? "1 attachment disassociated from '#{group.title}'." : "#{count} attachment(s) disassociated from '#{group.title}'."
    redirect_to "/admin/attachments/groups/#{group.id}", flash: { success: message }
  rescue => e
    Rails.logger.error "Error disassociating attachment(s): #{e.message}"
    redirect_to "/admin/attachments/groups/#{params[:id]}", flash: { error: "Failed to disassociate attachment(s): #{e.message}" }
  end

  private

  def sanitize_filename(filename)
    filename.to_s.gsub(" ", "_")
  end

  def attach_file_to_record(record, uploaded_file, filename)
    # Generate custom key: attachments/{id}/{filename}
    custom_key = "attachments/#{record.id}/#{filename}"

    record.file.attach(
      io: uploaded_file.tempfile,
      filename: filename,
      content_type: uploaded_file.content_type,
      key: custom_key
    )
  end
end
