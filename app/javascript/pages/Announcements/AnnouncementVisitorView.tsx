import RichMarkdown from "./RichMarkdownContent";

export default function AnnouncementVisitorView({
  announcement
}: any) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article>
      <header style={{
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
          lineHeight: '1.2',
          color: '#1f2937',
        }}>
          {announcement.title}
        </h1>

        {announcement.published_at && (
          <div className="flex items-center gap-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-base-content/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time className="text-base-content/70" dateTime={announcement.published_at}>
              {formatDate(announcement.published_at)}
            </time>
          </div>
        )}
      </header>

      <div className="prose prose-lg max-w-none" style={{
        lineHeight: '1.75',
      }}>
        <RichMarkdown>
          {announcement.content}
        </RichMarkdown>
      </div>
    </article>
  )
}
