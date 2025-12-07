import MediaGroupCard from './MediaGroupCard'

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
    <div style={{
      backgroundColor: 'var(--color-base-300)',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        alignItems: 'center',
      }}>
        <h1
          className="text-4xl font-bold"
          style={{
            color: 'var(--color-neutral)',
            marginBottom: '16px',
          }}
        >
          Media
        </h1>
        <div style={{
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
        </div>
      </div>
    </div>
  )
}
