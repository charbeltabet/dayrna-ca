class AttachmentGroupMembership < ApplicationRecord
  belongs_to :record_attachment
  belongs_to :attachments_group

  validates :record_attachment_id, uniqueness: { scope: :attachments_group_id }
end
