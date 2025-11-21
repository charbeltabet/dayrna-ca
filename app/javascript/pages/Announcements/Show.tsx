import { Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import HomeContext from "../Home/context";
import NavigationBar from "../NavigationBar";
import TopRibon from "../TopRibon";
import AnnouncementVisitorView from "./AnnouncementVisitorView";

export default function AnnouncementShow({
  homePageData,
  announcement,
  nextAnnouncement,
  previousAnnouncement,
}: any) {
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
          className="bg-base-100"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Fixed Breadcrumbs */}
          <div className="bg-base-100" style={{
            padding: '0px 16px',
            maxWidth: '1000px',
            borderBottom: '1px solid #e5e7eb',
          }}>
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
                      href="/announcements"
                      className="link link-primary"
                    >
                      Announcements
                    </Link>
                  </li>
                  <li>
                    <span>{announcement.title}</span>
                  </li>
                </ul>
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
              }}>
                {previousAnnouncement && (
                  <Link
                    href={`/announcements/${previousAnnouncement.id}`}
                    className="btn btn-outline btn-primary btn-xs"
                    title={previousAnnouncement.title}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </Link>
                )}
                {nextAnnouncement && (
                  <Link
                    href={`/announcements/${nextAnnouncement.id}`}
                    className="btn btn-outline btn-primary btn-xs"
                    title={nextAnnouncement.title}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            id="main-scroll-container"
            style={{
              flex: 1,
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            <div style={{
              padding: '0 16px',
              maxWidth: '1000px',
            }}>
              <div className="card shadow-xl" style={{ backgroundColor: '#f9fafb', borderRadius: 0 }}>
                <div className="card-body" style={{ padding: '16px' }}>
                  <AnnouncementVisitorView
                    announcement={announcement}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Navigation */}
          <div className="bg-base-100" style={{
            padding: '4px 16px',
            maxWidth: '1000px',
            borderTop: '1px solid #e5e7eb',
          }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                {previousAnnouncement && (
                  <Link
                    href={`/announcements/${previousAnnouncement.id}`}
                    className="btn btn-outline btn-primary w-full justify-start"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                      <div className="truncate">{previousAnnouncement.title}</div>

                    </div>
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-center">
                <Link
                  href="/announcements"
                  className="btn btn-primary btn-sm"
                >
                  View All Announcements
                </Link>
              </div>

              <div>
                {nextAnnouncement && (
                  <Link
                    href={`/announcements/${nextAnnouncement.id}`}
                    className="btn btn-outline btn-primary w-full justify-end"
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                      <div className="truncate">{nextAnnouncement.title}</div>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeContext.Provider>
  )
}