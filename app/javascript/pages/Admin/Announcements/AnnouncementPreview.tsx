import { router, usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"
import AttachementContentPreview from "./AttachementContentPreview"
import AnnouncementVisitorView from "../../Announcements/AnnouncementVisitorView"

export default function AnnouncementPreview() {
  const { props } = usePage()
  const { announcement } = props as any

  const [announcementData, setAnnouncementData] = useState(announcement)
  const [viewMode, setViewMode] = useState('content-edit')

  useEffect(() => {
    setAnnouncementData(announcement)
  }, [announcement.id, announcement.updated_at])

  return (
    <div style={{
      backgroundColor: 'white',
      height: '100%',
      border: '2px solid #ddd',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderBottom: '2px solid #ddd',
        padding: '4px',
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '4px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '2px',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            Title
            <input
              type="text"
              value={announcementData.title}
              onChange={(e) => {
                setAnnouncementData({
                  ...announcementData,
                  title: e.target.value,
                })
              }}
              placeholder="Announcement Title"
              className="input input input-sm"
              style={{
                border: '1px solid var(--color-base-300)',
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <button
              className="btn btn-primary btn-success btn-sm"
              onClick={() => {
                router.patch(`/admin/announcements/${announcementData.id}`,
                  announcementData
                );
              }}
            >
              Save
            </button>
            <button
              className="btn btn-error btn-sm"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this announcement?")) {
                  router.delete(`/admin/announcements/${announcementData.id}`);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '4px',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <input
            type="date"
            className="input input-sm"
            onChange={(e) => {
              setAnnouncementData({
                ...announcementData,
                published_at: e.target.value,
              })
            }}
            value={announcementData.published_at ? new Date(announcementData.published_at).toISOString().slice(0, 10) : ''}
          />
          <button
            className="btn btn-primary btn-success btn-sm"
            onClick={() => {
              router.patch(`/admin/announcements/${announcementData.id}`,
                {
                  ...announcementData,
                  published_at: announcementData.published_at || new Date().toISOString(),
                }
              );
            }}
          >
            Publish
          </button>
          <button
            className="btn btn-error btn-sm"
            onClick={() => {
              if (window.confirm("Are you sure you want to unpublish announcement?")) {
                router.patch(`/admin/announcements/${announcementData.id}`,
                  {
                    ...announcementData,
                    published_at: null,
                  }
                );
              }
            }}
          >
            Unpublish
          </button>
        </div>
        <div>
          <select
            className="select select-sm"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option disabled={true}>View mode</option>
            <option value="content-edit">Edit Content</option>
            <option value="visitor-view">Preview</option>
          </select>
        </div>
      </div>
      <div style={{
        flex: 1,
        overflow: 'auto',
        minHeight: 0,
      }}>
        {viewMode === 'content-edit' && (
          <AttachementContentPreview
            key={announcementData.id}
            content={announcementData['content'] || ''}
            onChange={(newContent: string) => {
              setAnnouncementData({
                ...announcementData,
                content: newContent,
              })
            }}
          />
        )}
        {viewMode === 'visitor-view' && (
          <div style={{
            padding: '8px'
          }}>
            <AnnouncementVisitorView
              announcement={announcementData}
            />
          </div>
        )}
      </div>
    </div>
  )
}
