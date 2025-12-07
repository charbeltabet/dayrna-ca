import { InfiniteScroll, Link, usePage } from '@inertiajs/react'
import { useRef, useState } from 'react'
import { PageProps as InertiaPageProps } from '@inertiajs/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { formatDate } from './Announcements/dates'

interface Attachment {
  id: number
  title: string | null
  description: string | null
  public_url: string
  thumbnail_url: string | null
  filename?: string
  created_at: string
}

interface PageProps extends InertiaPageProps {
  attachments: any
}

export function MediaAttachmentCard({ attachment, href }: { attachment: Attachment, href: string }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
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
        key={attachment.id}
        style={{
          aspectRatio: '1 / 1',
          backgroundColor: 'var(--color-base-100)',
          backgroundImage: `url(${attachment.public_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
        title={attachment.title || undefined}
      >
        {attachment.description && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), var(--color-neutral))',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '16px',
              pointerEvents: 'none',
            }}
          >
            <p
              style={{
                color: 'var(--color-white)',
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.4',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {formatDate(attachment.created_at)}
              {' - '}
              {attachment.description}
            </p>
          </div>
        )}
      </div>
      <div style={{
        backgroundColor: isHovered ? 'var(--color-neutral)' : 'var(--color-primary)',
        padding: '4px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: 'var(--color-base-100)',
        transition: 'background-color 0.3s ease',
      }}>
        <div style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          minWidth: 0,
        }}>
          {attachment.title || attachment.filename}
        </div>
        <div style={{
          flexShrink: 0,
          marginLeft: '4px',
        }}>
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </div>
    </Link>
  )
}

export default function OldMediaSection() {
  const { props } = usePage<PageProps>()
  const { attachments } = props
  const infiniteScrollRef = useRef<any>(null)

  const { data, meta } = attachments

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const scrolledToBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100

    if (scrolledToBottom && infiniteScrollRef.current) {
      infiniteScrollRef.current.fetchNext()
    }
  }

  return (
    <div style={{
      backgroundColor: 'var(--color-base-300)',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '20px 100px',
      gap: '50px'
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
        overflow: 'hidden',
        color: 'var(--color-neutral)',
      }}>
        <h1 className="text-4xl font-bold">
          Media
        </h1>
        <div style={{
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1400px',
          margin: '0 auto',
          gap: '4px',
        }}>
          <p
            className="text-2xl font-bold"
          >
            Messes précédentes ({meta.total_count})
          </p>
          <InfiniteScroll
            ref={infiniteScrollRef}
            data="attachments"
            manual
            preserveUrl
            onScroll={handleScroll}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '8px',
              maxHeight: '600px',
              overflowY: 'auto'
            }}
          >
            {data.map((attachment: Attachment) => (
              <MediaAttachmentCard key={attachment.id} attachment={attachment} />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  )
}
