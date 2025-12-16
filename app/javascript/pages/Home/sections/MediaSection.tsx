import { HomeSectionLayout } from '../../../components/HomeSectionLayout'
import MediaGroupCard from '../../MediaGroupCard'
import NavigationsDisplay from '../../Reference/NavigationsDisplay'

interface Attachment {
  id: number
  title: string | null
  description: string | null
  public_url: string
  thumbnail_url: string | null
  filename?: string
  created_at: string
}

interface AttachmentGroup {
  id: number
  title: string
  description: string | null
  recent_attachments: Attachment[]
  created_at: string
  updated_at: string
}

export default function MediaSection({
  attachmentGroups
}: {
  attachmentGroups: AttachmentGroup[]
}) {
  return (
    <HomeSectionLayout.Container style={{
      backgroundColor: 'var(--color-base-300)',
      color: 'var(--color-neutral)'
    }}>
      <HomeSectionLayout.Header>Media</HomeSectionLayout.Header>
      <HomeSectionLayout.Content style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
      }}>
        {attachmentGroups.map((attachmentGroup: AttachmentGroup) => (
          <MediaGroupCard
            key={attachmentGroup.id}
            attachmentGroup={attachmentGroup}
          />
        ))}
      </HomeSectionLayout.Content>
    </HomeSectionLayout.Container>
  )
}
