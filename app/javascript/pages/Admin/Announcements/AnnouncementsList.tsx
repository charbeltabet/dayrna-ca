import { faScroll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, router, usePage } from "@inertiajs/react";

function AdminAnnouncementCard({ announcement, currentAnnouncementId }: any) {
  const backgroundImage = announcement.image_url

  const active = currentAnnouncementId === announcement.id

  // Determine publication status
  const getPublicationStatus = () => {
    if (!announcement.published_at) {
      return { label: 'Non publié', color: '#dc2626', bgColor: '#fee2e2' } // red
    }

    const publishDate = new Date(announcement.published_at)
    const now = new Date()

    if (publishDate > now) {
      return { label: 'Planifié', color: '#d97706', bgColor: '#fef3c7' } // yellow
    }

    return { label: 'Publié', color: '#16a34a', bgColor: '#dcfce7' } // green
  }

  const status = getPublicationStatus()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      minHeight: '200px',
      border: '1px solid var(--color-base-300)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      backgroundColor: active ? 'var(--color-neutral)' : 'var(--color-white)',
    }}>
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt="Announcement"
          style={{
            aspectRatio: '1 / 1',
            width: '20%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div style={{
          height: '100%',
          width: '20%',
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
              fontSize: '48px',
              opacity: 0.7,
            }}
          />
        </div>
      )}

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        gap: '12px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '8px',
        }}>
          <h2 className="text-2xl font-bold" style={{
            margin: 0,
            color: active ? 'var(--color-white)' : 'var(--color-neutral)',
            lineHeight: '1.3',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            flex: 1,
          }}>
            {announcement.title}
          </h2>
          <span style={{
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 600,
            color: status.color,
            backgroundColor: status.bgColor,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {status.label}
          </span>
        </div>

        <div style={{
          flex: 1,
          position: 'relative',
          color: active ? 'var(--color-white)' : 'var(--color-base-content)',
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
            background: active
              ? 'linear-gradient(to bottom, transparent, var(--color-neutral))'
              : 'linear-gradient(to bottom, transparent, var(--color-white))',
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
              color: active ? 'var(--color-white)' : 'var(--color-base-content)',
              opacity: 0.7,
              margin: 0,
              fontWeight: 500,
            }}>
              {announcement.published_at ? (
                new Date(announcement.published_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              ) : (
                'Aucune date de publication'
              )}
            </p>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
          }}>
            {announcement.published_at && new Date(announcement.published_at) <= new Date() && (
              <Link href={`/announcements/${announcement.id}`}>
                <button className="btn btn-muted btn-sm">
                  Voir
                </button>
              </Link>
            )}
            <Link href={`/admin/announcements/${announcement.id}`} preserveState={true}>
              <button className="btn btn-primary btn-sm">
                Gérer
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AnnouncementsList() {
  const { props } = usePage()
  const { announcements, announcement } = props as any
  const currentAnnouncementId = announcement?.id

  return (
    <div style={{
      backgroundColor: 'white',
      height: '100%',
      border: '2px solid #ddd',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
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
        flexShrink: 0,
      }}>
        <div>
          Announcements
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '4px',
        }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              router.post("/admin/announcements", {});
            }}
          >
            New
          </button>
        </div>
      </div>
      <div style={{
        padding: '4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto',
        flex: 1,
        minHeight: 0,
      }}>
        {announcements.map((announcement: any) => (
          <AdminAnnouncementCard
            key={`announcement-${announcement.id}`}
            announcement={announcement}
            currentAnnouncementId={currentAnnouncementId}
          />
        ))}
      </div>
    </div>
  )
}
