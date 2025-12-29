import AdminLayout from "../Attachments/AdminLayout";
import AttachmentGroupsTable from "./AttachmentGroupsTable";
import NewAttachmentGroupForm from "./NewAttachmentGroupForm";
import AttachmentGroupPreview from "./AttachmentGroupPreview";
import { Link, router } from '@inertiajs/react';
import { truncateText } from "../../../utils/strings";

export function handleDelete(id: number, title: string) {
  if (window.confirm(`Are you sure you want to delete group "${title}"? This action cannot be undone.`)) {
    router.delete(`/admin/attachments/groups/${id}`);
  }
}

export default function AttachmentGroupsIndex({
  attachment_groups: attachmentGroups,
  'previewed_group': previewedGroup,
  'attachments_query': attachmentsQuery,
}: any) {
  const handleSortChange = (columnName: string, direction: 'asc' | 'desc' | null) => {
    console.log('Sort changed:', columnName, direction);
  };

  const headers = [
    {
      name: "title",
      label: "Title",
      renderCell: (row: any) => (
        <div style={{
          minWidth: '200px',
          maxWidth: '300px',
          overflow: 'hidden',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}>
          <Link
            className="link link-primary"
            style={{ cursor: 'pointer' }}
            href={`/admin/attachments/groups/${row.id}`}
            preserveState={true}
            only={['previewed_group']}
          >
            {row.title}
          </Link>
        </div >
      )
    },
    {
      name: "description",
      label: "Description",
      renderCell: (row: any) => (
        <div style={{
          minWidth: '200px',
          maxWidth: '400px',
          overflow: 'hidden',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}>
          {truncateText(row.description, 150)}
        </div>
      )
    },
    {
      name: "attachment_count",
      label: "Attachments",
      renderCell: (row: any) => (
        <div style={{
          width: '100px',
          textAlign: 'center',
        }}>
          <span style={{
            backgroundColor: row.attachment_count > 0 ? '#570df8' : '#ddd',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {row.attachment_count}
          </span>
        </div>
      )
    },
    { name: "created_at", label: "Created" },
    {
      name: "updated_at",
      label: "Updated",
      renderCellActions: (row: any) => (
        <div style={{
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: '4px',
          }}>
            <Link
              className="btn btn-sm btn-info"
              style={{ cursor: 'pointer' }}
              href={`/admin/attachments/groups/${row.id}`}
              preserveState={true}
              only={['previewed_group']}
            >
              Edit
            </Link>
            <a
              className="btn btn-sm btn-error"
              style={{ cursor: 'pointer' }}
              onClick={() => handleDelete(row.id, row.title)}
            >
              Delete
            </a>
          </div>
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
          width: '50%',
          flexShrink: 0,
          overflowX: 'hidden',
        }}>
          <AttachmentGroupsTable
            headers={headers}
            data={attachmentGroups.data}
            groupsCount={attachmentGroups.count}
            onSortChange={handleSortChange}
            highlightedRowId={previewedGroup ? previewedGroup.id : null}
          />
        </div>
        <div style={{
          width: '50%',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}>
          {previewedGroup ? (
            <AttachmentGroupPreview
              groupRow={previewedGroup}
              onDelete={handleDelete}
              attachmentsQuery={attachmentsQuery}
              key={previewedGroup.id}
            />
          ) : (
            <NewAttachmentGroupForm />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
