import { useRef, useEffect, useState } from "react";
import AnnouncementCard from "../../AnnouncementCard";

export default function TimeSection({
  announcements
}: any) {
  const calendarFrameRef = useRef<HTMLDivElement>(null)
  const [calendarDimensions, setCalendarDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (calendarFrameRef.current) {
        setCalendarDimensions({
          width: calendarFrameRef.current.offsetWidth,
          height: calendarFrameRef.current.offsetHeight
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

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
        <div
          ref={calendarFrameRef}
          style={{
            width: '100%',
            height: '400px',
          }}
        >
          {calendarDimensions.width > 0 && (
            <iframe
              src="https://calendar.google.com/calendar/embed?src=3eca8543cc46a40dcc1f3b8f64bce471ade25b51c0bfe5b3a07cc42e6a947229%40group.calendar.google.com&ctz=America%2FNipigon&mode=AGENDA"
              style={{
                border: 0
              }}
              width={calendarDimensions.width}
              height={calendarDimensions.height}
            />
          )}
        </div>
      </div>
    </div>
  )
}
