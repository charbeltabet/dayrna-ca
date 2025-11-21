import AnnouncementCard from "./AnnouncementCard";

export default function TimeSection({
  announcements
}: any) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '20px 100px',
      backgroundColor: 'var(--color-base-100)',
      gap: '50px'
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <h1 className="text-4xl font-bold">
          Annonces
        </h1>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          height: '400px',
          overflowY: 'auto',
        }}>
          {announcements.map((announcement: any) => (
            <AnnouncementCard
              key={`announcement-card-${announcement.id}`}
              announcement={announcement}
            />
          ))}
        </div>
      </div>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <h1 className="text-4xl font-bold">
          Calendrier
        </h1>
        <div style={{
          width: '100%',
          height: '400px',
          backgroundColor: 'orange'
        }}>
          embedded calendar
        </div>
      </div>
    </div>
  )
}
