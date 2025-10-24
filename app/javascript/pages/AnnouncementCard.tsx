import { faScroll } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function AnnouncementCard() {
  // const backgroundImage = `https://picsum.photos/seed/${Math.random()}/200/300`
  const backgroundImage = ''
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      height: '200px',
      width: '100%',
      border: '1px solid var(--color-base-300)',
    }}>

      {backgroundImage ? (
        <div style={{
          height: '100%',
          width: '35%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
      ) : (
        <div style={{
          height: '100%',
          width: '35%',
          backgroundColor: 'var(--color-base-300)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <FontAwesomeIcon
            icon={faScroll}
            style={{
              color: 'var(--color-primary)',
              fontSize: '96px',
            }}
          />
        </div>
      )}

      <div style={{
        flex: 1,
        backgroundColor: 'var(--color-white)',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        gap: '10px',
      }}>
        <h2 className="text-2xl font-bold" style={{
          margin: 0,
          color: 'var(--color-neutral)',
        }}>
          Titre de l'annonce
        </h2>
        <div style={{
          flex: 1,
          color: 'var(--color-base-content)',
          fontSize: '14px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '40px'
        }}>
          Ceci est un exemple de contenu d'annonce. Il peut contenir plusieurs lignes de texte pour donner plus d'informations sur l'annonce en question.
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <p style={{
              fontSize: '13px',
            }}>
              1 janvier 2024, #123
            </p>
          </div>
          <button className="btn btn-primary btn-sm">
            Lire la suite
          </button>
        </div>
      </div>
    </div>
  )
}
