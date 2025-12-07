import { Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ContentLayout from "../shared/ContentLayout";

interface Attachment {
  id: number
  title: string | null
  description: string | null
  public_url: string
  thumbnail_url: string | null
  filename?: string
  created_at: string
}

interface AttachmentInfo {
  id: number
  title: string | null
}

interface GroupInfo {
  id: number
  title: string
}

export default function MediaAttachmentShow({
  homePageData,
  attachment,
  group,
  nextAttachment,
  previousAttachment,
}: {
  homePageData: any
  attachment: Attachment
  group: GroupInfo
  nextAttachment: AttachmentInfo | null
  previousAttachment: AttachmentInfo | null
}) {
  const displayTitle = attachment.title || attachment.filename || 'Untitled'

  const renderBreadcrumbs = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link
              href="/"
              className="link link-primary"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/media"
              className="link link-primary"
            >
              Media
            </Link>
          </li>
          <li>
            <Link
              href={`/media/${group.id}`}
              className="link link-primary"
            >
              {group.title}
            </Link>
          </li>
          <li>
            <span>{displayTitle}</span>
          </li>
        </ul>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
      }}>
        {previousAttachment && (
          <Link
            href={`/media/${group.id}/attachments/${previousAttachment.id}`}
            className="btn btn-outline btn-primary btn-xs"
            title={previousAttachment.title || 'Previous'}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Link>
        )}
        {nextAttachment && (
          <Link
            href={`/media/${group.id}/attachments/${nextAttachment.id}`}
            className="btn btn-outline btn-primary btn-xs"
            title={nextAttachment.title || 'Next'}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </Link>
        )}
      </div>
    </div>
  );

  const renderFooterNavigation = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        {previousAttachment && (
          <Link
            href={`/media/${group.id}/attachments/${previousAttachment.id}`}
            className="btn btn-outline btn-primary w-full justify-start"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
              <div className="truncate">{previousAttachment.title || 'Previous'}</div>
            </div>
          </Link>
        )}
      </div>

      <div className="flex items-center justify-center">
        <Link
          href={`/media/${group.id}`}
          className="btn btn-primary btn-sm"
        >
          View All in {group.title}
        </Link>
      </div>

      <div>
        {nextAttachment && (
          <Link
            href={`/media/${group.id}/attachments/${nextAttachment.id}`}
            className="btn btn-outline btn-primary w-full justify-end"
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
              <div className="truncate">{nextAttachment.title || 'Next'}</div>
            </div>
            <FontAwesomeIcon icon={faChevronRight} />
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <ContentLayout
      homePageData={homePageData}
      breadcrumbs={renderBreadcrumbs()}
      footerNavigation={renderFooterNavigation()}
    >
      <div style={{
        padding: '0 16px',
        maxWidth: '1000px',
      }}>
        <div className="card shadow-xl" style={{ backgroundColor: '#f9fafb', borderRadius: 0 }}>
          <div className="card-body" style={{ padding: '16px' }}>
            <article>
              <header style={{
                marginBottom: '32px',
                paddingBottom: '24px',
                borderBottom: '1px solid #e5e7eb',
              }}>
                <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
                  lineHeight: '1.2',
                  color: '#1f2937',
                }}>
                  {displayTitle}
                </h1>
                {attachment.description && (
                  <p className="text-lg text-gray-600">
                    {attachment.description}
                  </p>
                )}
              </header>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '24px',
              }}>
                <img
                  src={attachment.public_url}
                  alt={displayTitle}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    border: '1px solid #e5e7eb',
                  }}
                />
              </div>

              {attachment.filename && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '4px',
                }}>
                  <p className="text-sm text-gray-600">
                    <strong>File:</strong> {attachment.filename}
                  </p>
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
