import { Link } from '@inertiajs/react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faImages } from '@fortawesome/free-solid-svg-icons'

interface Attachment {
  id: number
  title: string | null
  description: string | null
  public_url: string
  thumbnail_url: string | null
  filename?: string
  created_at: string
}

interface AttachmentGroup {
  id: number
  title: string
  description: string | null
  recent_attachments: Attachment[]
  created_at: string
  updated_at: string
}

export default function MediaGroupCard({ attachmentGroup }: { attachmentGroup: AttachmentGroup }) {
  const [isHovered, setIsHovered] = useState(false)

  // Get up to 8 images from recent_attachments
  const images = attachmentGroup.recent_attachments.slice(0, 8)

  return (
    <Link
      href={`/media/${attachmentGroup.id}`}
      style={{
        overflow: 'hidden',
        border: '1px solid var(--color-base-300)',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-0.5px)' : 'translateY(0)',
        borderColor: isHovered ? 'var(--color-primary)' : 'var(--color-base-300)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          aspectRatio: '1 / 1',
          backgroundColor: 'var(--color-base-200)',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr 1fr',
            height: '100%',
            width: '100%',
            gap: '2px',
            backgroundColor: 'var(--color-base-300)',
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            images[index] ? (
              <div
                key={index}
                style={{
                  backgroundImage: `url(${images[index].public_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%',
                }}
              />
            ) : (
              <div
                key={index}
                style={{
                  backgroundColor: 'var(--color-base-200)',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-base-400)',
                }}
              >
                <FontAwesomeIcon icon={faImages} style={{ fontSize: '16px', opacity: 0.3 }} />
              </div>
            )
          ))}
        </div>
      </div>
      <div style={{
        backgroundColor: isHovered ? 'var(--color-neutral)' : 'var(--color-primary)',
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'var(--color-base-100)',
        transition: 'background-color 0.3s ease',
        minHeight: '48px',
      }}>
        <div style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          minWidth: 0,
          fontSize: '16px',
          fontWeight: 600,
        }}>
          {attachmentGroup.title}
        </div>
        <div style={{
          flexShrink: 0,
          marginLeft: '8px',
        }}>
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </div>
    </Link>
  )
}
