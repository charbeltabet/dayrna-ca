import AttachmentsTable from "./AttachmentsTable";
import { Link, router } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faPenToSquare, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { formatDateTime } from "../../Announcements/dates";
import { truncateText, truncateFilename } from "../../../utils/strings";

export function handleDelete(id: number, filename: string) {
  if (window.confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
    router.delete(`/admin/attachments/${id}`);
  }
}

export default function AttachmentsTableDisplay({
  attachments,
  previewedAttachment
}: any) {
  const handleSortChange = (columnName: string, direction: 'asc' | 'desc' | null) => {
    router.visit('', {
      data: {
        order_by: columnName,
        order: direction
      },
      preserveState: true,
      preserveScroll: true,
    })
  };

  const headers = [
    {
      name: "id",
      label: "ID",
      renderCell: (row: any) => (
        <div>
          {row.id}
        </div>
      )
    },
    {
      name: "groups",
      label: "Groups",
      renderCell: (row: any) => (
        <div style={{
          minWidth: '50px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '4px',
          overflow: 'scroll'
        }}>
          {row.attachments_groups && row.attachments_groups.length > 0 ? (
            row.attachments_groups.map((group: any) => (
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
        <div
          style={{
            backgroundImage: `url(${row.public_url})`,
            width: '100%',
            aspectRatio: '1 / 1',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
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
          overflow: 'scroll',
        }}>
          {truncateText(row.description, 1000)}
        </div>
      ),
    },
    {
      name: "filename",
      label: "File name",
      renderCell: (row: any) => (
        <div style={{
          minWidth: '150px',
          overflowY: 'auto',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          paddingRight: '4px',
        }}>
          {truncateFilename(row.filename, 20)}
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
      name: "created_at",
      label: "Created",
      headerStyles: {
        minWidth: '150px'
      },
      renderCell: (row: any) => (
        <div>
          {formatDateTime(row.created_at)}
        </div>
      )
    },
    {
      name: "updated_at",
      label: "Updated",
      headerStyles: {
        minWidth: '150px'
      },
      renderCell: (row: any) => (
        <div>
          {formatDateTime(row.updated_at)}
        </div>
      ),
      renderCellActions: (row: any) => (
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
            <FontAwesomeIcon icon={faPenToSquare} />
          </Link>
          <a
            className="btn btn-sm btn-error"
            onClick={() => handleDelete(row.id, row.filename)}
          >
            <FontAwesomeIcon icon={faDeleteLeft} />
          </a>
          <a
            className="btn btn-sm btn-primary"
            style={{ cursor: 'pointer' }}
            href={row.public_url}
            target="_blank"
          >
            <FontAwesomeIcon icon={faUpRightFromSquare} />
          </a>
        </div>
      )
    },
  ];

  return (
    <AttachmentsTable
      headers={headers}
      data={attachments.data}
      hasMore={attachments.metadata.has_more}
      filesCount={attachments.metadata.total}
      byteSize={attachments.metadata.byte_size}
      onSortChange={handleSortChange}
      highlightedRowId={previewedAttachment ? previewedAttachment.id : null}
      searchQuery={attachments.metadata.query}
      sortColumn={attachments.metadata.order_by}
      sortDirection={attachments.metadata.order}
    />
  )
}
