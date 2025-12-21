import ScriptureSlideEditor from './ScriptureSlideEditor';
import AttachmentGroupSelector from './AttachmentGroupSelector';
import { FormProvider } from 'react-hook-form';
import { CollapsibleSection } from './CollapsibleSection';
import { FormField } from '../../../../components/FormField';
import { useInertiaForm } from './hooks/useInertiaForm';

interface HomePageData {
  top_ribbon: {
    phone: string;
    email: string;
    youtube_url: string;
    facebook_url: string;
  };
  hero_section: {
    subtitle: string;
    heading: string;
    description: string;
    button_text: string;
    button_link: string;
    gallery_group: string;
    mass_schedule: {
      weekday: string;
      sunday: string;
    };
    sanctuary_hours: string;
  };
}

interface HomeFormProps {
  serverData: HomePageData;
  homePreviewRef: any;
}

export default function HomeForm({ serverData, homePreviewRef }: HomeFormProps) {
  const {
    formMethods,
    onSubmit,
    isSubmitting,
    onCancel
  } = useInertiaForm({
    serverData,
    options: {
      url: '/admin/homepage',
      method: 'patch',
    },
    routerOptions: {
      onSuccess: () => {
        if (!homePreviewRef.current) return

        homePreviewRef.current.refresh()
      },
      onFinish: () => {
        console.log('finished submitting form')
      }
    }
  })

  const {
    formState: { isDirty }
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={onSubmit}
        className="shadow-sm"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-base-200)',
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
            <CollapsibleSection.Container
              title="Top Ribbon"
              description="Configure the contact information and social media links displayed at the top of the page."
            >
              <FormField.Container>
                <FormField.Field
                  name="top_ribbon.address"
                  label="Address"
                  registerProps={{ required: false }}
                />

                <FormField.Field
                  name="top_ribbon.phone"
                  label="Phone Number"
                  placeholder="+1 (514) 123-1234"
                  registerProps={{ required: true }}
                />

                <FormField.Field
                  name="top_ribbon.email"
                  label="Email"
                  registerProps={{ required: false }}
                />

                <FormField.Field
                  name="top_ribbon.youtube_url"
                  label="YouTube URL"
                  registerProps={{ required: false }}
                />

                <FormField.Field
                  name="top_ribbon.facebook_url"
                  label="Facebook URL"
                  registerProps={{ required: false }}
                />
              </FormField.Container>
            </CollapsibleSection.Container>

            <CollapsibleSection.Container
              title="Scripture Slideshow"
              description="Manage the rotating scripture slides with background images. These will cycle automatically on the homepage."
            >
              <ScriptureSlideEditor />
            </CollapsibleSection.Container>

            <CollapsibleSection.Container
              title="Hero Section"
              description="Edit the main welcome section with title, description, mass schedule, and sanctuary hours."
            >
              <FormField.Container>
                <FormField.Field
                  name="hero_section.subtitle"
                  label="Subtitle (e.g., &quot;Paroisse et Monastère&quot;)"
                  placeholder="Paroisse et Monastère"
                />

                <FormField.Field
                  name="hero_section.heading"
                  label="Main Heading"
                  placeholder="St. Antoine - Outremont"
                />

                <FormField.Field
                  name="hero_section.description"
                  label="Description"
                  placeholder="Au service des besoins spirituels et communautaires..."
                  type="textarea"
                  rows={3}
                />

                <FormField.Field
                  name="hero_section.button_text"
                  label="Button Text"
                  placeholder="À propos de nous"
                />

                <FormField.Field
                  name="hero_section.button_link"
                  label="Button Link"
                  placeholder="/about"
                />

                <AttachmentGroupSelector name="hero_section.gallery_group" />

                <FormField.Section title="Schedule">
                  <FormField.Field
                    name="hero_section.mass_schedule.weekday"
                    label="Weekday (Monday-Saturday)"
                    placeholder="19h00"
                  />

                  <FormField.Field
                    name="hero_section.mass_schedule.sunday"
                    label="Sunday"
                    placeholder="10h00, 11h30, 19h00"
                  />

                  <FormField.Field
                    name="hero_section.sanctuary_hours"
                    label="Sanctuary Hours"
                    placeholder="9h00 - 20h30"
                  />
                </FormField.Section>
              </FormField.Container>
            </CollapsibleSection.Container>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
            padding: '4px 0',
            backgroundColor: 'var(--color-base-300)',
            justifyContent: 'flex-end'
          }}
        >
          {isDirty && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="btn"
              style={{
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </form>
    </FormProvider>
  )
}
