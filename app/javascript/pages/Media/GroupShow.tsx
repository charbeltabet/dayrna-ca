import { Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ContentLayout from "../shared/ContentLayout";
import { MediaAttachmentCard } from "../OldMediaSection";

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
  attachments: Attachment[]
}

interface GroupInfo {
  id: number
  title: string
}

export default function MediaGroupShow({
  homePageData,
  group,
  nextGroup,
  previousGroup,
}: {
  homePageData: any
  group: AttachmentGroup
  nextGroup: GroupInfo | null
  previousGroup: GroupInfo | null
}) {
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
            <span>{group.title}</span>
          </li>
        </ul>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
      }}>
        {previousGroup && (
          <Link
            href={`/media/${previousGroup.id}`}
            className="btn btn-outline btn-primary btn-xs"
            title={previousGroup.title}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Link>
        )}
        {nextGroup && (
          <Link
            href={`/media/${nextGroup.id}`}
            className="btn btn-outline btn-primary btn-xs"
            title={nextGroup.title}
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
        {previousGroup && (
          <Link
            href={`/media/${previousGroup.id}`}
            className="btn btn-outline btn-primary w-full justify-start"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
              <div className="truncate">{previousGroup.title}</div>
            </div>
          </Link>
        )}
      </div>

      <div className="flex items-center justify-center">
        <Link
          href="/media"
          className="btn btn-primary btn-sm"
        >
          View All Media
        </Link>
      </div>

      <div>
        {nextGroup && (
          <Link
            href={`/media/${nextGroup.id}`}
            className="btn btn-outline btn-primary w-full justify-end"
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
              <div className="truncate">{nextGroup.title}</div>
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
                  {group.title}
                </h1>
                {group.description && (
                  <p className="text-lg text-gray-600">
                    {group.description}
                  </p>
                )}
              </header>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                {group.attachments.map((attachment) => (
                  // <Link
                  //   key={attachment.id}
                  //   href={`/media/${group.id}/attachments/${attachment.id}`}
                  //   style={{
                  //     aspectRatio: '1 / 1',
                  //     overflow: 'hidden',
                  //     border: '1px solid #e5e7eb',
                  //     cursor: 'pointer',
                  //     transition: 'all 0.2s ease',
                  //   }}
                  //   className="hover:border-primary hover:shadow-lg"
                  // >
                  //   <div
                  //     style={{
                  //       width: '100%',
                  //       height: '100%',
                  //       backgroundImage: `url(${attachment.public_url})`,
                  //       backgroundSize: 'cover',
                  //       backgroundPosition: 'center',
                  //     }}
                  //   />
                  // </Link>
                  <MediaAttachmentCard
                    key={`attachment-card-${attachment.id}`}
                    attachment={attachment}
                    href={`/media/${group.id}/attachments/${attachment.id}`}
                  />
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
