import AdminLayout from "../Attachments/AdminLayout";
import AnnouncementPreview from "./AnnouncementPreview";
import AnnouncementsList from "./AnnouncementsList";

export default function AdminAnnouncementsShow() {
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
          <AnnouncementPreview />
        </div>
      </div>
    </AdminLayout>
  )
}