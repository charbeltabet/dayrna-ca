import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faScroll,
  faHandsPraying,
  faChurch,
  faBook,
  faHeart,
  faDove,
  faCross,
  faGem,
  faWineGlass,
  faStar,
  faBookBible,
  faHands
} from '@fortawesome/free-solid-svg-icons'

const sections = [
  { name: 'Relics', url: '/pages/relics', icon: faGem },
  { name: 'Saints', url: '/pages/saints', icon: faHandsPraying },
  { name: 'Churches', url: '/pages/churches', icon: faChurch },
  { name: 'Prayers', url: '/pages/prayers', icon: faBook },
  { name: 'Devotions', url: '/pages/devotions', icon: faHeart },
  { name: 'Holy Spirit', url: '/pages/holy_spirit', icon: faDove },
  { name: 'Cross', url: '/pages/cross', icon: faCross },
  { name: 'Sacraments', url: '/pages/sacraments', icon: faWineGlass },
  { name: 'Miracles', url: '/pages/miracles', icon: faStar },
  { name: 'Scripture', url: '/pages/scripture', icon: faBookBible },
  { name: 'Liturgy', url: '/pages/liturgy', icon: faScroll },
  { name: 'Blessings', url: '/pages/blessings', icon: faHands },
]

export default function NavigationSections() {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      gap: '10px',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--color-neutral)',
      color: 'var(--color-base-300)',
      padding: '20px 100px',
    }}>
      <h1 className="text-4xl font-bold">
        Référence
      </h1>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '15px',
        justifyContent: 'center',
        width: '100%',
      }}>
        {sections.map((section) => (
          <a
            key={`page-${section.url}`}
            href={section.url}
          >
            <div
              style={{
                minWidth: '175px',
                aspectRatio: '1 / 1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px',
                backgroundColor: 'var(--color-base-100)',
                color: 'var(--color-neutral)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: '20px',
              }}
              className="hover:shadow-lg hover:scale-105"
            >
              <FontAwesomeIcon
                icon={section.icon}
                style={{
                  fontSize: '48px',
                  color: 'var(--color-primary)'
                }}
              />
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                textAlign: 'center',
              }}>
                {section.name}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
