import AdminLayout from "./AdminLayout";
import NewAttachmentForm from "./NewAttachmentForm";
import AttachmentPreview from "./AttachmentPreview";
import { useScreenSize } from "../../../hooks/useScreenSize";
import AttachmentsTableDisplay from "./AttachmentsTableDisplay";

export default function AdminAttachmentsIndex({
  attachments,
  'previewed_attachment': previewedAttachment,
}: any) {
  const { screenLargerThan } = useScreenSize()

  return (
    <AdminLayout>
      <div style={{
        display: 'flex',
        flexDirection: screenLargerThan('md') ? 'row' : 'column',
        gap: '8px',
        flex: 1,
        minHeight: 0,
      }}>
        <div style={{
          flex: 2,
          overflowX: 'hidden',
          backgroundColor: '#ddd'
        }}>
          <AttachmentsTableDisplay
            attachments={attachments}
            previewedAttachment={previewedAttachment}
          />
        </div>
        <div style={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {previewedAttachment ? (
            <AttachmentPreview
              serverData={previewedAttachment}
              key={`attachment-preview-${previewedAttachment.id}`}
            />
          ) : (
            <NewAttachmentForm
            />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
