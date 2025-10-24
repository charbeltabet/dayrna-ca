import { faYoutube, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faHouse, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TopRibon() {
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
    }}>

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
          1520 Av. Ducharme, Outremont, QC H2V 1G1, Canada
        </div>
      </div>

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
          (514) 271-2000
        </div>
      </div>

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
          info@dayrna.ca
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        <FontAwesomeIcon icon={faYoutube} />
        <FontAwesomeIcon icon={faFacebook} />
      </div>

    </div>
  )
}
