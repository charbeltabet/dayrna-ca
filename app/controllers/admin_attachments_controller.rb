class AdminAttachmentsController < ApplicationController
  PER_PAGE = 50

  def index
    page = [ params.fetch("page", 1).to_i, 1 ].max
    records_count = RecordAttachment.count

    render inertia: "Admin/Attachments/Index", props: {
      attachments: InertiaRails.scroll(
        {
          page_name: "page",
          previous_page: page > 1 ? page - 1 : nil,
          next_page: records_count > page * PER_PAGE ? page + 1 : nil,
          current_page: page,
          total_count: records_count
        },
        wrapper: "data"
      ) {
        order_by = params[:order_by]
        order = params[:order]
        query = params[:query]
        offset = (page - 1) * PER_PAGE
        limit = PER_PAGE

        records = RecordAttachment.all

        filtered_records = records.fetch_records({
          search_fields: [ "title", "description" ],
          order_by: order_by,
          order: order,
          query: query,
          offset: offset,
          limit: limit
        })

        data = filtered_records.as_json(
          methods: [
            :filename,
            :content_type,
            :human_readable_size,
            :public_url
          ],
          include: [
            :attachments_groups
          ]
        )

        {
          data: data,
          metadata: {
            order: order,
            order_by: order_by,
            total: records.count,
            byte_size: records.human_readable_total_size,
            query: query,
            has_more: records_count > page * PER_PAGE
          }
        }
      },
      previewed_attachment: -> {
        return unless params[:id]

        record = RecordAttachment.find(params[:id])
        record.as_json(
          methods: [
            :filename,
            :content_type,
            :human_readable_size,
            :public_url
          ],
          include: {
            attachments_groups: {
              methods: [
                :option
              ]
            }
          },
        )
      }
    }
  end

  def create
    files = create_params[:files] || {}

    last_id = nil
    uploaded_records = []

    files.values.map do |file|
      record = RecordAttachment.create_from_file(file)

      uploaded_records << record
      last_id = record.id
    end

    redirect_to "/admin/attachments/#{last_id}", flash: { success: "#{uploaded_records.count} attachment(s) uploaded successfully." }
  end

  def update
    record_attachment = RecordAttachment.find(params[:id])
    record_attachment.update!(update_attributes)

    file = update_params[:file]
    record_attachment.attach_file(file) if file

    attachments_groups_ids = update_params[:attachments_groups_ids]
    record_attachment.associate_to_attachment_groups(attachments_groups_ids) if attachments_groups_ids

    redirect_to "/admin/attachments/#{record_attachment.id}", flash: { success: "Attachment #{record_attachment.filename} updated successfully." }
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
            show_on_homepage: group.show_on_homepage,
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
  end

  def update_group
    group = AttachmentsGroup.find(params[:id])

    update_params = {}
    update_params[:title] = params[:title] if params[:title].present?
    update_params[:description] = params[:description] if params[:description].present?
    update_params[:show_on_homepage] = params[:show_on_homepage] unless params[:show_on_homepage].nil?

    group.update!(update_params) if update_params.any?

    redirect_to "/admin/attachments/groups/#{group.id}", flash: { success: "Group '#{group.title}' updated successfully." }
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
  end

  def search
    records = RecordAttachment.search(params[:query].to_s).limit(20)
    data = records.map do |record|
      {
        value: record.id,
        label: record.filename.to_s,
        thumbnail_url: record.public_url
      }
    end
    render json: data
  end

  def search_groups
    query = params[:query].to_s.strip
    records = if query.present?
      AttachmentsGroup.where(
        "title LIKE ? OR description LIKE ?",
        "%#{query}%",
        "%#{query}%"
      ).order(:title).limit(20)
    else
      AttachmentsGroup.order(:title).limit(20)
    end

    data = records.map do |group|
      {
        value: group.id,
        label: group.title,
        description: group.description,
        attachment_count: group.record_attachments.count
      }
    end
    render json: data
  end

  private

  def create_params
    params
      .require(:admin_attachments)
      .permit(
        :files_urls,
        files: {},
      )
  end

  def update_params
    params
      .require(:admin_attachments)
      .permit(
        :id,
        :title,
        :description,
        :file,
        attachments_groups_ids: []
      )
  end

  def update_attributes
    update_params.slice(
      :title,
      :description,
    )
  end
end
