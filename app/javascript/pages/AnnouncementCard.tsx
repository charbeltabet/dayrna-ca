import { faScroll } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "@inertiajs/react"
import { formatDate } from "./Announcements/dates"

export default function AnnouncementCard({
  announcement
}: any) {
  // const backgroundImage = `https://picsum.photos/seed/${Math.random()}/200/300`
  const backgroundImage = announcement.image_url
  return (
    <Link
      href={`/announcements/${announcement.id}`}
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        height: '200px',
        width: '100%',
        border: '1px solid var(--color-base-300)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-0.5px)'
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.12)'
          e.currentTarget.style.borderColor = 'var(--color-primary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
          e.currentTarget.style.borderColor = 'var(--color-base-300)'
        }}
      >

        {backgroundImage ? (
          <div style={{
            height: '100%',
            width: '35%',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            aspectRatio: '1 / 1',
            backgroundPosition: 'center',
            flexShrink: 0,
          }} />
        ) : (
          <div style={{
            height: '100%',
            width: '35%',
            backgroundColor: 'var(--color-base-300)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <FontAwesomeIcon
              icon={faScroll}
              style={{
                color: 'var(--color-primary)',
                fontSize: '96px',
                opacity: 0.7,
              }}
            />
          </div>
        )}

        <div style={{
          flex: 1,
          backgroundColor: 'var(--color-white)',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          gap: '12px',
        }}>
          <h2 className="text-2xl font-bold" style={{
            margin: 0,
            color: 'var(--color-neutral)',
            lineHeight: '1.3',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {announcement.title}
          </h2>
          <div style={{
            flex: 1,
            position: 'relative',
            color: 'var(--color-base-content)',
            fontSize: '14px',
            lineHeight: '1.6',
            overflow: 'hidden',
            minHeight: '40px',
          }}>
            <div style={{
              maxHeight: '100%',
              overflow: 'hidden',
            }}>
              {announcement.text_preview}
            </div>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40px',
              background: 'linear-gradient(to bottom, transparent, var(--color-white))',
              pointerEvents: 'none',
            }} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
          }}>
            <div>
              <p style={{
                fontSize: '13px',
                color: 'var(--color-base-content)',
                opacity: 0.7,
                margin: 0,
                fontWeight: 500,
              }}>
                {announcement.published_at && (
                  formatDate(announcement.published_at)
                )}
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              Lire la suite
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
