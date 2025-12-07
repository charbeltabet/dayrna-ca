import { Link } from "@inertiajs/react";
import HomeContext from "../Home/context";
import NavigationBar from "../NavigationBar";
import TopRibon from "../TopRibon";
import MediaGroupCard from "../MediaGroupCard";

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

export default function MediaIndex({ homePageData, attachmentGroups }: any) {
  return (
    <HomeContext.Provider value={{ homePageData }}>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TopRibon />
        <NavigationBar />
        <div
          id="main-scroll-container"
          className="bg-base-100"
          style={{
            flex: 1,
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          <div style={{
            padding: '0px 16px',
            maxWidth: '1000px',
          }}>
            <div className="bg-base-100" style={{
              borderBottom: '1px solid #e5e7eb',
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
                    <span>
                      Media
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '16px'
            }}>
              <h1 className="text-5xl font-bold mb-6">
                Media
              </h1>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '64px',
              }}>
                {attachmentGroups.map((attachmentGroup: AttachmentGroup) => (
                  <MediaGroupCard
                    key={`media-group-card-${attachmentGroup.id}`}
                    attachmentGroup={attachmentGroup}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeContext.Provider>
  )
}
