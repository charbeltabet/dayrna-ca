import { faChurch, faCalendarDays, faHandsPraying } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FactItem from "../../FactItem";
import ShowcaseGallery from "../../ShowcaseGallery";
import HomeContext from "../context";
import { useContext } from "react";

export default function HeroSection() {
  const { homePageData } = useContext(HomeContext);
  const heroSection = homePageData?.hero_section || {};

  // Extract image URLs from gallery_images
  const galleryImageUrls = heroSection.gallery_images?.map((img: any) => img.public_url) || [];

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
          {heroSection.subtitle && (
            <p className="" style={{ gridColumn: '1', whiteSpace: 'nowrap' }}>
              {heroSection.subtitle}
            </p>
          )}
          {heroSection.heading && (
            <h1 className="text-5xl font-bold" style={{
              gridColumn: '1',
              whiteSpace: 'nowrap',
              margin: 0
            }}>
              {heroSection.heading}
            </h1>
          )}
          {heroSection.description && (
            <p className="pt-6 pb-3" style={{
              gridColumn: '1',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto'
            }}>
              {heroSection.description}
            </p>
          )}
          {heroSection.button_text && (
            <a
              href={heroSection.button_link || '#'}
              className="btn btn-primary"
              style={{ gridColumn: '1', justifySelf: 'start' }}
            >
              {heroSection.button_text}
            </a>
          )}

          {(heroSection.mass_schedule?.weekday || heroSection.mass_schedule?.sunday || heroSection.sanctuary_hours) && (
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
                {(heroSection.mass_schedule?.weekday || heroSection.mass_schedule?.sunday) && (
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
                        {heroSection.mass_schedule?.weekday && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FontAwesomeIcon icon={faCalendarDays} style={{ color: 'var(--color-accent)', fontSize: '12px' }} />
                            <span><strong>Lundi - Samedi:</strong> {heroSection.mass_schedule.weekday}</span>
                          </div>
                        )}
                        {heroSection.mass_schedule?.sunday && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FontAwesomeIcon icon={faCalendarDays} style={{ color: 'var(--color-accent)', fontSize: '12px' }} />
                            <span><strong>Dimanche:</strong> {heroSection.mass_schedule.sunday}</span>
                          </div>
                        )}
                      </div>
                    </FactItem>
                  </div>
                )}

                {heroSection.sanctuary_hours && (
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
                          <span><strong>Lundi - Dimanche:</strong> {heroSection.sanctuary_hours}</span>
                        </div>
                      </div>
                    </FactItem>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        <div
          className="shadow-2xl"
          style={{
            width: '100%',
            maxWidth: '650px',
            aspectRatio: '16 / 9',
          }}>
          <ShowcaseGallery imageUrls={galleryImageUrls} />
        </div>
      </div>
    </div>
  )
}
