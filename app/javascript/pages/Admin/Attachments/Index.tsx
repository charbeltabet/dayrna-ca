import AdminLayout from "./AdminLayout";
import AttachmentsTable from "./AttachmentsTable";
import NewAttachmentForm from "./NewAttachmentForm";
import { Link, router } from '@inertiajs/react';
import AttachmentPreview from "./AttachmentPreview";
import { truncateText } from "../../utils";

export function handleDelete(id: number, filename: string) {
  if (window.confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
    router.delete(`/admin/attachments/${id}`);
  }
}

export default function AdminAttachmentsIndex({
  attachments,
  'previewed_attachment': previewedAttachment,
}: any) {
  const handleSortChange = (columnName: string, direction: 'asc' | 'desc' | null) => {
    console.log('Sort changed:', columnName, direction);
  };

  const headers = [
    {
      name: "groups",
      label: "Groups",
      renderCell: (row: any) => (
        <div style={{
          width: '150px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{
            backgroundColor: 'purple',
            padding: '4px',
            width: 'fit-content',
            color: 'white'
          }}>
            group name
          </div>
        </div >
      )
    },
    {
      name: "filename",
      label: "Name",
      renderCell: (row: any) => (
        <div style={{
          minWidth: '100px',
          maxWidth: '200px',
          overflow: 'hidden',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}>
          <Link
            className="link link-primary"
            style={{ cursor: 'pointer' }}
            href={`/admin/attachments/${row.id}`}
            preserveState={true}
            only={['previewed_attachment']}
          >
            {row.filename}
          </Link>
        </div >
      )
    },
    {
      name: "human_readable_size",
      label: "Size",
      renderCell: (row: any) => (
        <div style={{
          width: '75px',
          overflow: 'hidden',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}>
          {row.human_readable_size}
        </div>
      )
    },
    {
      name: "title",
      label: "Title",
      renderCell: (row: any) => (
        <div style={{
          width: '75px',
          overflow: 'hidden',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}>
          {truncateText(row.title, 100)}
        </div>
      )
    },
    {
      name: "description",
      label: "Description",
      renderCell: (row: any) => (
        <div style={{
          width: '75px',
          overflow: 'hidden',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}>
          {truncateText(row.description, 100)}
        </div>
      )
    },
    { name: "created_at", label: "Created" },
    {
      name: "updated_at",
      label: "Updated",
      renderCellActions: (row: any) => (
        <div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
          }}>
            <Link
              className="link link-info"
              style={{ cursor: 'pointer' }}
              href={`/admin/attachments/${row.id}`}
              preserveState={true}
              only={['previewed_attachment']}
            >
              Edit
            </Link>
            <a
              className="link"
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => handleDelete(row.id, row.filename)}
            >
              Delete
            </a>
          </div>
          <a
            className="link link-primary"
            style={{ cursor: 'pointer' }}
            href={row.url}
            target="_blank"
          >
            Open
          </a>
        </div>
      )
    },
  ];

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
          <AttachmentsTable
            headers={headers}
            data={attachments.data}
            filesCount={attachments.count}
            byteSize={attachments.byte_size}
            onSortChange={handleSortChange}
            highlightedRowId={previewedAttachment ? previewedAttachment.id : null}
          />
        </div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}>
          {previewedAttachment ? (
            <AttachmentPreview
              attachmentRow={previewedAttachment}
              key={previewedAttachment.id}
            />
          ) : (
            <NewAttachmentForm />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
