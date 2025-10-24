import { faChurch, faCalendarDays, faHandsPraying } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FactItem from "./FactItem";

export default function HeroSection() {
  return (
    <div className="hero bg-base-300">
      <div className="hero-content flex-col lg:flex-row w-full justify-between p-0 py-6" style={{
        alignItems: 'center',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'min-content',
          gap: '0.5rem',
        }}>
          <p className="" style={{ gridColumn: '1', whiteSpace: 'nowrap' }}>Paroisse et Monastère</p>
          <h1 className="text-5xl font-bold" style={{
            gridColumn: '1',
            whiteSpace: 'nowrap',
            margin: 0
          }}>
            St. Antoine - Outremont
          </h1>
          <p className="pt-6 pb-3" style={{
            gridColumn: '1',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto'
          }}>
            Au service des besoins spirituels et communautaires de notre congrégation avec dévotion et foi à Montréal depuis 1984.
          </p>
          <button className="btn btn-primary" style={{ gridColumn: '1', justifySelf: 'start' }}>
            À propos de nous
          </button>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '7.5px',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                backgroundColor: 'var(--color-base-200)',
                width: 'fit-content',
              }}>
                <FactItem icon={faChurch} title="Messes">
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FontAwesomeIcon icon={faCalendarDays} style={{ color: 'var(--color-accent)', fontSize: '12px' }} />
                      <span><strong>Lundi - Samedi:</strong> 19h00</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FontAwesomeIcon icon={faCalendarDays} style={{ color: 'var(--color-accent)', fontSize: '12px' }} />
                      <span><strong>Dimanche:</strong> 10h00, 11h30, 19h00</span>
                    </div>
                  </div>
                </FactItem>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                backgroundColor: 'var(--color-base-200)',
                width: 'fit-content',
              }}>
                <FactItem icon={faHandsPraying} title="Sanctuaire des Saints">
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FontAwesomeIcon icon={faCalendarDays} style={{ color: 'var(--color-accent)', fontSize: '12px' }} />
                      <span><strong>Lundi - Dimanche:</strong> 9h00 - 20h30</span>
                    </div>

                  </div>
                </FactItem>
              </div>
            </div>
          </div>

        </div>

        <div
          className="shadow-2xl"
          style={{
            width: '100%',
            maxWidth: '650px',
            aspectRatio: '16 / 9',
          }}>
          {/* <ShowcaseGallery
              images={[
                [
                  { url: `https://picsum.photos/seed/${Math.random()}/200/300` },
                  { url: `https://picsum.photos/seed/${Math.random()}/200/300` },
                  { url: `https://picsum.photos/seed/${Math.random()}/200/300` },
                  { url: `https://picsum.photos/seed/${Math.random()}/200/300` },
                  { url: `https://picsum.photos/seed/${Math.random()}/200/300` },
                ],
                [
                  { url: `https://picsum.photos/seed/${Math.random()}/200/300` },
                  { url: `https://picsum.photos/seed/${Math.random()}/200/300` },
                  { url: `https://picsum.photos/seed/${Math.random()}/200/300` },
                  { url: `https://picsum.photos/seed/${Math.random()}/200/300` },
                  { url: `https://picsum.photos/seed/${Math.random()}/200/300` },
                  { url: `https://picsum.photos/seed/${Math.random()}/200/300` },
                ]
              ]}
            /> */}
        </div>
      </div>
    </div>
  )
}
