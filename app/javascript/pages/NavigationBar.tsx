import { faHouse, faPhotoFilm, faComments, faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavigationBar() {
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
        </div>
        <div className="navbar-center">
          <ul className="menu bg-base-300 lg:menu-horizontal">
            <li className="menu-active">
              <a>
                <FontAwesomeIcon icon={faHouse} />
                Main
              </a>
            </li>
            <li>
              <a>
                <FontAwesomeIcon icon={faPhotoFilm} />
                Media
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-end d-flex flex-row gap-2">
          <button className="btn btn-primary">
            Contact Us
            <FontAwesomeIcon icon={faComments} />
          </button>
          <button className="btn btn-info">
            Donate
            <FontAwesomeIcon icon={faHandHoldingDollar} />
          </button>
        </div>
      </div>
    </div>


  )
}
