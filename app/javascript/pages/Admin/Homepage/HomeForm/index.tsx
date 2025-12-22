import ScriptureSlideEditor from './ScriptureSlideEditor';
import AttachmentGroupSelector from './AttachmentGroupSelector';
import { FormProvider, get } from 'react-hook-form';
import { CollapsibleSection } from './CollapsibleSection';
import { FormField } from '../../../../components/FormField';
import { useInertiaForm } from './hooks/useInertiaForm';

interface HomeFormProps {
  serverData: any;
  serverErrors?: any;
  homePreviewRef: any;
}

export default function HomeForm({
  serverData,
  serverErrors,
  homePreviewRef
}: HomeFormProps) {
  const {
    formMethods,
    onSubmit,
    isSubmitting,
    onCancel
  } = useInertiaForm({
    key: 'home_page',
    serverData,
    serverErrors,
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
    },
    cleanBeforeSubmit: (data) => {
      if (!(data.scripture_slides && Array.isArray(data.scripture_slides))) {
        return data
      }

      data.scripture_slides = data.scripture_slides.map((slide: any) => ({
        scripture_text: slide.scripture_text,
        reference: slide.reference,
        record_attachment_id: slide.record_attachment_id
      }));

      data.hero_section.gallery_group_id = get(data, 'hero_section.gallery_group.value', null);
      delete data.hero_section.gallery_group;

      return data;
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
