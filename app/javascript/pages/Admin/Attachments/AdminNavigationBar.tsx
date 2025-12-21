import { faHouse, faLayerGroup, faMap, faPhotoFilm, faScroll, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@inertiajs/react";

export default function AdminNavigationBar() {
  const path = window.location.pathname;
  return (
    <div style={{
      height: '70px',
      width: '100%',
      backgroundColor: 'var(--color-background)',
      display: 'flex',
      flexDirection: 'row',
    }}>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <img
            src="/logo.png"
            style={{
              height: '60px',
            }}
          />
          Administrator
        </div>
        <div className="navbar-center">
          <ul className="menu menu-sm bg-base-300 lg:menu-horizontal">
            <li
              className={/^\/admin\/homepage(\/\d+)?$/.test(path) ? "menu-active" : ""}
            >
              <Link
                href="/admin/homepage"
              >
                <FontAwesomeIcon icon={faHouse} />
                Homepage
              </Link>
            </li>
          </ul>
          <ul className="menu menu-sm bg-base-300 lg:menu-horizontal">
            <li
              className={/^\/admin\/navigations(\/\d+)?$/.test(path) ? "menu-active" : ""}
            >
              <Link
                href="/admin/navigations"
              >
                <FontAwesomeIcon icon={faMap} />
                Navigation
              </Link>
            </li>
          </ul>
          <ul className="menu menu-sm bg-base-300 lg:menu-horizontal">
            <li
              className={/^\/admin\/attachments(\/\d+)?$/.test(path) ? "menu-active" : ""}
            >
              <Link
                href="/admin/attachments"
              >
                <FontAwesomeIcon icon={faPhotoFilm} />
                Attachments
              </Link>
            </li>
          </ul>
          <ul className="menu menu-sm bg-base-300 lg:menu-horizontal">
            <li
              className={/^\/admin\/attachments\/groups(\/.*)?$/.test(path) ? "menu-active" : ""}
            >
              <Link
                href="/admin/attachments/groups"
              >
                <FontAwesomeIcon icon={faLayerGroup} />
                Attachment Groups
              </Link>
            </li>
          </ul>
          <ul className="menu menu-sm bg-base-300 lg:menu-horizontal">
            <li
              className={/^\/admin\/announcements(\/.*)?$/.test(path) ? "menu-active" : ""}
            >
              <Link
                href="/admin/announcements"
              >
                <FontAwesomeIcon icon={faScroll} />
                Announcements
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end d-flex flex-row gap-2">
          <Link href="/">
            <button className="btn btn-sm btn-primary">
              Visitor View
              <FontAwesomeIcon icon={faUsers} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
