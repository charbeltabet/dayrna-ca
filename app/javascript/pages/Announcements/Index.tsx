import { Link } from "@inertiajs/react";
import HomeContext from "../Home/context";
import NavigationBar from "../NavigationBar";
import TopRibon from "../TopRibon";
import AnnouncementCard from "../AnnouncementCard";
import { formatDate } from "./dates";

export default function AnnouncementsIndex({ homePageData, announcements }: any) {
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
                      Announcements
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '16px'
            }}>
              <h1 className="text-5xl font-bold mb-2">
                Announcements
              </h1>
              {announcements.length > 0 && (
                <p className="text-sm text-gray-500 mb-6">
                  Last published on {formatDate(announcements[0].published_at)}
                </p>
              )}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(800px, 1fr))',
                gap: '12px',
                marginBottom: '64px',
              }}>
                {announcements.map((announcement: any) => (
                  <AnnouncementCard
                    key={`announcement-card-${announcement.id}`}
                    announcement={announcement}
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