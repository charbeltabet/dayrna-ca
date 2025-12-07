import { Link, router } from '@inertiajs/react';

interface Page {
  id: number;
  title: string;
  slug: string;
  position: number;
  full_path: string;
}

interface PagesListProps {
  pages: Page[];
  navigationId: number;
}

function PageCard({ page, navigationId, isFirst, isLast }: { page: Page; navigationId: number; isFirst: boolean; isLast: boolean }) {
  const handleMove = (direction: 'up' | 'down') => {
    const newPosition = direction === 'up' ? page.position - 1 : page.position + 1;
    router.patch(`/admin/navigations/${navigationId}/pages/${page.id}`, {
      position: newPosition
    }, {
      preserveScroll: true,
      preserveState: true
    });
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
      router.delete(`/admin/navigations/${navigationId}/pages/${page.id}`);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-base-100)',
        border: '1px solid var(--color-base-300)',
        padding: '12px',
        marginBottom: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
            {page.title}
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--color-base-content)', opacity: 0.7 }}>
            {page.full_path}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleMove('up')}
          disabled={isFirst}
          style={{
            padding: '4px 8px',
            border: '1px solid var(--color-base-300)',
            background: 'var(--color-base-100)',
            cursor: isFirst ? 'not-allowed' : 'pointer',
            opacity: isFirst ? 0.5 : 1,
            fontSize: '12px'
          }}
          title="Move up"
        >
          ↑
        </button>

        <button
          onClick={() => handleMove('down')}
          disabled={isLast}
          style={{
            padding: '4px 8px',
            border: '1px solid var(--color-base-300)',
            background: 'var(--color-base-100)',
            cursor: isLast ? 'not-allowed' : 'pointer',
            opacity: isLast ? 0.5 : 1,
            fontSize: '12px'
          }}
          title="Move down"
        >
          ↓
        </button>

        <Link href={`/admin/navigations/${navigationId}/pages/${page.id}`}>
          <button
            className="btn btn-primary btn-sm"
            style={{
              padding: '4px 8px',
              fontSize: '12px'
            }}
          >
            Edit
          </button>
        </Link>

        <button
          onClick={handleDelete}
          style={{
            padding: '4px 8px',
            border: '1px solid var(--color-error)',
            background: 'var(--color-error)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Delete page"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function PagesList({ pages, navigationId }: PagesListProps) {
  const handleAddPage = () => {
    router.post(`/admin/navigations/${navigationId}/pages`, {
      title: "New Page",
      content: "Page content goes here."
    });
  };

  if (pages.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ marginBottom: '16px', opacity: 0.7 }}>
          No pages yet for this navigation.
        </p>
        <button
          onClick={handleAddPage}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--color-primary)',
            background: 'var(--color-primary)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          + Add Page
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '8px' }}>
      <div style={{ marginBottom: '8px' }}>
        {pages.map((page, index) => (
          <PageCard
            key={page.id}
            page={page}
            navigationId={navigationId}
            isFirst={index === 0}
            isLast={index === pages.length - 1}
          />
        ))}
      </div>
      <button
        onClick={handleAddPage}
        style={{
          padding: '8px 16px',
          border: '1px solid var(--color-primary)',
          background: 'var(--color-primary)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          width: '100%'
        }}
      >
        + Add Page
      </button>
    </div>
  );
}
