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
  'all_groups': allGroups,
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
          minWidth: '50px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '4px'
        }}>
          {row.groups && row.groups.length > 0 ? (
            row.groups.map((group: any) => (
              <Link
                key={`${row.id}-group-${group.id}`}
                className="link link-primary"
                style={{
                  backgroundColor: '#570df8',
                  padding: '4px 8px',
                  width: 'fit-content',
                  color: 'white',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
                href={`/admin/attachments/groups/${group.id}`}
                preserveState={true}
              >
                {group.title}
              </Link>
            ))
          ) : (
            <Link
              key={`${row.id}-new-group`}
              href={`/admin/attachments/${row.id}`}
              className="link link-primary"
            >
              Add to group
            </Link>
          )}
        </div >
      )
    },
    {
      name: "attachment_preview",
      label: "Preview",
      renderCell: (row: any) => (
        <img
          src={row.url}
          alt={row.filename}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      )
    },
    {
      name: "filename",
      label: "Name",
      renderCell: (row: any) => (
        <div style={{
          maxHeight: '60px',
          minWidth: '200px',
          overflowY: 'auto',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          paddingRight: '4px',
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
          width: '200px',
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
          width: '200px',
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
          }}>
            <Link
              className="btn btn-sm btn-info"
              href={`/admin/attachments/${row.id}`}
              preserveState={true}
              only={['previewed_attachment']}
            >
              Edit
            </Link>
            <a
              className="btn btn-sm btn-error"
              onClick={() => handleDelete(row.id, row.filename)}
            >
              Delete
            </a>
          </div>
          <a
            className="btn btn-sm btn-primary"
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
              allGroups={allGroups || []}
              key={previewedAttachment.id}
            />
          ) : (
            <NewAttachmentForm allGroups={allGroups || []} />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
