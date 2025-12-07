# frozen_string_literal: true

class MediaController < ApplicationController
  def index
    attachment_groups = AttachmentsGroup.all.order(created_at: :desc)

    # Include recent attachments for preview
    attachment_groups_data = attachment_groups.map do |group|
      group.as_json.merge(
        recent_attachments: group.record_attachments
          .where("record_attachments.created_at IS NOT NULL")
          .order(created_at: :desc)
          .limit(8)
          .as_json(methods: [ :public_url ])
      )
    end

    render inertia: "Media/Index", props: {
      attachmentGroups: attachment_groups_data
    }
  end

  def show_group
    group = AttachmentsGroup.find(params[:id])

    # Get all attachments in this group
    attachments = group.record_attachments
      .where("record_attachments.created_at IS NOT NULL")
      .order(created_at: :desc)
      .as_json(methods: [ :public_url, :thumbnail_url ])

    # Calculate next and previous groups
    next_group = AttachmentsGroup
      .where("created_at >= ?", group.created_at)
      .where.not(id: group.id)
      .order(created_at: :asc)
      .first

    previous_group = AttachmentsGroup
      .where("created_at <= ?", group.created_at)
      .where.not(id: group.id)
      .order(created_at: :desc)
      .first

    render inertia: "Media/GroupShow", props: {
      group: group.as_json.merge(attachments: attachments),
      nextGroup: next_group&.as_json(only: [ :id, :title ]),
      previousGroup: previous_group&.as_json(only: [ :id, :title ])
    }
  end

  def show_attachment
    attachment = RecordAttachment.find(params[:id])

    # Get the group from the URL (assuming attachment belongs to this group)
    group = AttachmentsGroup.find(params[:group_id])

    # Get all attachments in this group ordered by created_at
    attachments_in_group = group.record_attachments
      .where("record_attachments.created_at IS NOT NULL")
      .order(created_at: :desc)
      .to_a

    # Find current index and calculate prev/next
    current_index = attachments_in_group.index(attachment)

    next_attachment = if current_index && current_index < attachments_in_group.length - 1
      attachments_in_group[current_index + 1]
    else
      nil
    end

    previous_attachment = if current_index && current_index > 0
      attachments_in_group[current_index - 1]
    else
      nil
    end

    render inertia: "Media/AttachmentShow", props: {
      attachment: attachment.as_json(methods: [ :public_url, :thumbnail_url, :filename ]),
      group: group.as_json(only: [ :id, :title ]),
      nextAttachment: next_attachment&.as_json(only: [ :id, :title ]),
      previousAttachment: previous_attachment&.as_json(only: [ :id, :title ])
    }
  end
end
