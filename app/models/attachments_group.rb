class AttachmentsGroup < ApplicationRecord
  has_many :attachment_group_memberships, dependent: :destroy
  has_many :record_attachments, through: :attachment_group_memberships

  def option
    {
      value: self.id,
      label: self.title,
      description: self.description,
      attachment_count: self.record_attachments.count
    }
  end
end
