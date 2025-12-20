import { useScriptureSlideEditor, ScriptureSlide } from './useScriptureSlideEditor';
import ScriptureSlideEditor from './ScriptureSlideEditor';
import { CollapsibleSection } from './CollapsibleSection';
import AttachmentGroupSelector from './AttachmentGroupSelector';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface HomeFormProps {
  homePageData: any;
  setHomePageData: (data: any) => void;
  initialData: any;
}

export default function HomeForm({
  homePageData,
  setHomePageData,
  initialData
}: HomeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    slides,
    addSlide,
    updateSlide,
    deleteSlide,
    moveSlide
  } = useScriptureSlideEditor(
    homePageData?.scripture_slides || [],
    (updatedSlides: ScriptureSlide[]) => {
      setHomePageData({
        ...homePageData,
        scripture_slides: updatedSlides
      });
    }
  );

  const handleSubmit = () => {
    setIsSubmitting(true);

    router.patch(
      '/admin/homepage',
      { data: homePageData },
      {
        preserveState: true,
        onSuccess: () => {
          console.log('Homepage data saved successfully');
        },
        onError: (errors) => {
          console.error('Failed to save homepage data:', errors);
        },
        onFinish: () => {
          setIsSubmitting(false);
        }
      }
    );
  };

  const handleCancel = () => {
    setHomePageData(initialData);
  };

  return (
    <div
      className="shadow-sm"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-base-100)',
      }}
    >
      <div
        style={{
          height: '100%',
          padding: '8px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <CollapsibleSection
            title="Top Ribbon"
            description="Configure the contact information and social media links displayed at the top of the page."
          >
            <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                  Address
                </label>
                <input
                  type="text"
                  value={homePageData?.top_ribbon?.address || ''}
                  onChange={(e) => setHomePageData({
                    ...homePageData,
                    top_ribbon: { ...homePageData?.top_ribbon, address: e.target.value }
                  })}
                  placeholder="1520 Av. Ducharme, Outremont, QC H2V 1G1, Canada"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-base-300)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  value={homePageData?.top_ribbon?.phone || ''}
                  onChange={(e) => setHomePageData({
                    ...homePageData,
                    top_ribbon: { ...homePageData?.top_ribbon, phone: e.target.value }
                  })}
                  placeholder="(514) 271-2000"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-base-300)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={homePageData?.top_ribbon?.email || ''}
                  onChange={(e) => setHomePageData({
                    ...homePageData,
                    top_ribbon: { ...homePageData?.top_ribbon, email: e.target.value }
                  })}
                  placeholder="info@dayrna.ca"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-base-300)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={homePageData?.top_ribbon?.youtube_url || ''}
                  onChange={(e) => setHomePageData({
                    ...homePageData,
                    top_ribbon: { ...homePageData?.top_ribbon, youtube_url: e.target.value }
                  })}
                  placeholder="https://youtube.com/@yourchannel"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-base-300)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={homePageData?.top_ribbon?.facebook_url || ''}
                  onChange={(e) => setHomePageData({
                    ...homePageData,
                    top_ribbon: { ...homePageData?.top_ribbon, facebook_url: e.target.value }
                  })}
                  placeholder="https://facebook.com/yourpage"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-base-300)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Hero Section"
            description="Edit the main welcome section with title, description, mass schedule, and sanctuary hours."
          >
            <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                  Subtitle (e.g., "Paroisse et Monastère")
                </label>
                <input
                  type="text"
                  value={homePageData?.hero_section?.subtitle || ''}
                  onChange={(e) => setHomePageData({
                    ...homePageData,
                    hero_section: { ...homePageData?.hero_section, subtitle: e.target.value }
                  })}
                  placeholder="Paroisse et Monastère"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-base-300)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                  Main Heading
                </label>
                <input
                  type="text"
                  value={homePageData?.hero_section?.heading || ''}
                  onChange={(e) => setHomePageData({
                    ...homePageData,
                    hero_section: { ...homePageData?.hero_section, heading: e.target.value }
                  })}
                  placeholder="St. Antoine - Outremont"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-base-300)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                  Description
                </label>
                <textarea
                  value={homePageData?.hero_section?.description || ''}
                  onChange={(e) => setHomePageData({
                    ...homePageData,
                    hero_section: { ...homePageData?.hero_section, description: e.target.value }
                  })}
                  placeholder="Au service des besoins spirituels et communautaires..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-base-300)',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                  Button Text
                </label>
                <input
                  type="text"
                  value={homePageData?.hero_section?.button_text || ''}
                  onChange={(e) => setHomePageData({
                    ...homePageData,
                    hero_section: { ...homePageData?.hero_section, button_text: e.target.value }
                  })}
                  placeholder="À propos de nous"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-base-300)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                  Button Link
                </label>
                <input
                  type="text"
                  value={homePageData?.hero_section?.button_link || ''}
                  onChange={(e) => setHomePageData({
                    ...homePageData,
                    hero_section: { ...homePageData?.hero_section, button_link: e.target.value }
                  })}
                  placeholder="/about"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-base-300)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                  Mass Schedule
                </label>

                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>
                    Weekday (Monday-Saturday)
                  </label>
                  <input
                    type="text"
                    value={homePageData?.hero_section?.mass_schedule?.weekday || ''}
                    onChange={(e) => setHomePageData({
                      ...homePageData,
                      hero_section: {
                        ...homePageData?.hero_section,
                        mass_schedule: {
                          ...homePageData?.hero_section?.mass_schedule,
                          weekday: e.target.value
                        }
                      }
                    })}
                    placeholder="19h00"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--color-base-300)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>
                    Sunday
                  </label>
                  <input
                    type="text"
                    value={homePageData?.hero_section?.mass_schedule?.sunday || ''}
                    onChange={(e) => setHomePageData({
                      ...homePageData,
                      hero_section: {
                        ...homePageData?.hero_section,
                        mass_schedule: {
                          ...homePageData?.hero_section?.mass_schedule,
                          sunday: e.target.value
                        }
                      }
                    })}
                    placeholder="10h00, 11h30, 19h00"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--color-base-300)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                  Sanctuary Hours
                </label>
                <input
                  type="text"
                  value={homePageData?.hero_section?.sanctuary_hours || ''}
                  onChange={(e) => setHomePageData({
                    ...homePageData,
                    hero_section: { ...homePageData?.hero_section, sanctuary_hours: e.target.value }
                  })}
                  placeholder="9h00 - 20h30"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-base-300)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                  Gallery Images
                </label>
                <AttachmentGroupSelector
                  value={homePageData?.hero_section?.gallery_group}
                  onChange={(value) => setHomePageData({
                    ...homePageData,
                    hero_section: {
                      ...homePageData?.hero_section,
                      gallery_group: value,
                      gallery_group_id: value?.value
                    }
                  })}
                />
              </div>

            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Scripture Slideshow"
            description="Manage the rotating scripture slides with background images. These will cycle automatically on the homepage."
          >
            <div style={{ marginBottom: '12px' }}>
              <ScriptureSlideEditor
                slides={slides}
                onUpdate={updateSlide}
                onDelete={deleteSlide}
                onAdd={addSlide}
                onMove={moveSlide}
              />
            </div>
          </CollapsibleSection>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', padding: '8px', backgroundColor: 'var(--color-neutral)' }}>
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className="btn btn-secondary"
          style={{
            flex: 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn btn-primary"
          style={{
            flex: 1,
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Saving...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}
