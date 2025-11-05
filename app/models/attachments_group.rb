class AttachmentsGroup < ApplicationRecord
  has_many :attachment_group_memberships, dependent: :destroy
  has_many :record_attachments, through: :attachment_group_memberships
end
