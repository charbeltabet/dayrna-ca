import { faYoutube, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faHouse, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeContext from "./Home/context";
import { useContext } from "react";

export default function TopRibon() {
  const { homePageData } = useContext(HomeContext);
  const topRibbon = homePageData?.top_ribbon || {};

  return (
    <div style={{
      backgroundColor: 'var(--color-neutral)',
      color: 'var(--color-base-300)',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'row',
      gap: '40px',
      justifyContent: 'flex-start',
      width: '100%',
      flexShrink: 0,
      zIndex: 1000,
    }}>

      {topRibbon.address && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
        }}>
          <FontAwesomeIcon
            icon={faHouse}
            style={{
            }}
          />
          <div>
            {topRibbon.address}
          </div>
        </div>
      )}

      {topRibbon.phone && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
        }}>
          <FontAwesomeIcon
            icon={faPhone}
            style={{
            }}
          />
          <div>
            {topRibbon.phone}
          </div>
        </div>
      )}

      {topRibbon.email && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
        }}>
          <FontAwesomeIcon
            icon={faEnvelope}
            style={{
            }}
          />
          <div>
            {topRibbon.email}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
        {topRibbon.youtube_url && (
          <a href={topRibbon.youtube_url} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        )}

        {topRibbon.facebook_url && (
          <a href={topRibbon.facebook_url} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
        )}
      </div>

      {/* links to add here */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>

      </div>

    </div>
  )
}
