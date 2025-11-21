import AdminLayout from "../Attachments/AdminLayout";
import AnnouncementsList from "./AnnouncementsList";

export default function AdminAnnouncementsIndex() {
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
          <AnnouncementsList />
        </div>
        <div style={{
          flex: 2.5,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}>
          Select an announcement to preview and edit.
        </div>
      </div>
    </AdminLayout>
  )
}