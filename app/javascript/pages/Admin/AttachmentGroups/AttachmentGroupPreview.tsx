import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import AttachmentsTable from "../Attachments/AttachmentsTable";
import NewAttachmentForm from "../Attachments/NewAttachmentForm";
import { Link, router } from "@inertiajs/react";
import { truncateText } from "../../utils";

interface AttachmentGroupPreviewProps {
  groupRow: any;
  onDelete: (id: number, title: string) => void;
  attachmentsQuery?: string | null;
}

export default function AttachmentGroupPreview({
  groupRow,
  onDelete,
  attachmentsQuery = null
}: AttachmentGroupPreviewProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const { data, setData, patch, processing } = useForm<{
    title: string;
    description: string;
    show_on_homepage: boolean;
  }>({
    title: groupRow.title || '',
    description: groupRow.description || '',
    show_on_homepage: groupRow.show_on_homepage ?? true,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(`/admin/attachments/groups/${groupRow.id}`, {
      preserveState: true,
      onSuccess: (page) => {
        const updatedGroup = page.props.previewed_group as any;
        if (updatedGroup) {
          setData({
            title: updatedGroup.title || '',
            description: updatedGroup.description || '',
            show_on_homepage: updatedGroup.show_on_homepage ?? true,
          });
        }
      }
    });
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
      }}>
        <div style={{
          width: '100%',
          backgroundColor: '#f5f5f5',
          borderBottom: '2px solid #ddd',
          padding: '4px 8px',
          fontWeight: 'bold',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            {groupRow.title}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
          }}>
            {/* Attachments section header with toggle button */}
            {!showUploadForm && (
              <button
                className="btn btn-primary btn-md"
                onClick={() => setShowUploadForm(true)}
              >
                + New Attachments
              </button>
            )}
            <button
              className="btn btn-error"
              onClick={() => onDelete(groupRow.id, groupRow.title)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {showUploadForm ? (
        <NewAttachmentForm
          groupId={groupRow.id}
          onCancel={() => setShowUploadForm(false)}
          title="Upload New Attachments To Group"
        />
      ) : (
        <>
          {/* Form section (top row) */}
          <div style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #ddd',
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <form onSubmit={handleSubmit} onKeyDown={(e) => {
              if (e.shiftKey && e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                />
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <label className="label">
                  <span className="label-text">Show on homepage</span>
                </label>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={data.show_on_homepage}
                  onChange={(e) => {
                    setData('show_on_homepage', e.target.checked);
                  }}
                />
              </div>
            </form>
          </div>

          {/* Save button section */}
          <div style={{
            backgroundColor: 'white',
            padding: '3px 12px',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={processing}
            >
              {processing ? 'Saving...' : 'Save'}
            </button>
          </div>

          {/* Bottom row - Attachments section with toggle */}
          <div style={{
            flex: 1,
            backgroundColor: 'white',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'hidden',
          }}>
            {/* Content area */}
            <div style={{
              flex: 1,
              overflowY: 'hidden',
              minHeight: 0,
            }}>
              <AttachmentsTable
                mode="group-attachments"
                searchKbd="A"
                groupId={groupRow.id}
                headers={[
                  {
                    name: "in_group",
                    label: "Status",
                    renderCell: (row: any) => (
                      <div style={{
                        width: '80px',
                        textAlign: 'center'
                      }}>
                        {row.in_group ? (
                          <span style={{
                            backgroundColor: '#570df8',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}>
                            IN GROUP
                          </span>
                        ) : (
                          <span style={{ color: '#999', fontSize: '12px' }}>-</span>
                        )}
                      </div>
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
                    label: "Filename",
                    renderCell: (row: any) => (
                      <div style={{
                        minWidth: '150px',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}>
                        {row.filename}
                      </div>
                    )
                  },
                  {
                    name: "title",
                    label: "Title",
                    renderCell: (row: any) => (
                      <div style={{
                        minWidth: '100px',
                        maxWidth: '150px',
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
                        minWidth: '150px',
                        maxWidth: '200px',
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
                    renderCellActions: (row: any) => {
                      const handleAssociate = () => {
                        router.post(`/admin/attachments/groups/${groupRow.id}/associate`, {
                          attachment_ids: row.id
                        }, {
                          preserveState: true,
                          only: ['previewed_group', 'attachment_groups']
                        });
                      };

                      const handleDisassociate = () => {
                        router.post(`/admin/attachments/groups/${groupRow.id}/disassociate`, {
                          attachment_ids: row.id
                        }, {
                          preserveState: true,
                          only: ['previewed_group', 'attachment_groups']
                        });
                      };

                      return (
                        <div>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}>
                            {row.in_group ? (
                              <button
                                className="btn btn-error"
                                onClick={handleDisassociate}
                              >
                                Disassociate
                              </button>
                            ) : (
                              <button
                                className="btn btn-success"
                                onClick={handleAssociate}
                              >
                                Associate
                              </button>
                            )}
                            <Link
                              className="link link-info"
                              style={{ cursor: 'pointer' }}
                              href={`/admin/attachments/${row.id}`}
                              preserveState={true}
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      );
                    }
                  }
                ]}
                data={groupRow.attachments.data}
                filesCount={groupRow.attachments.count}
                onSortChange={(columnName, direction) => {
                  console.log('Sort changed:', columnName, direction);
                }}
                searchQuery={attachmentsQuery}
                onlyParam="previewed_group"
                queryParam="attachments_query"
                title="Attachments"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
