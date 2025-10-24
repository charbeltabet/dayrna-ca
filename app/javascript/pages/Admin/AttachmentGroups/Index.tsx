import AdminLayout from "../Attachments/AdminLayout";

export default function AttachmentGroupsIndex({ groups }: any) {
  return (
    <AdminLayout>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        flex: 1,
        minHeight: 0
      }}>
        <div style={{
          flex: 1,
          overflowX: 'hidden',
        }}>
          <AttachmentsGroupsTable
            headers={headers}
            data={groups.data}
            groupsCount={groups.count}
            onSortChange={handleSortChange}
            highlightedRowId={previewedGroup ? previewedGroup.id : null}
          />
        </div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}>
          {/* {previewedAttachment ? (
            <AttachmentPreview
              attachmentRow={previewedAttachment}
              key={previewedAttachment.id}
            />
          ) : (
            <NewAttachmentForm />
          )} */}
        </div>
      </div>
    </AdminLayout>
  )
}
