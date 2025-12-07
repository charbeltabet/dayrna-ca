import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AttachementContentPreview from '../Announcements/AttachementContentPreview';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  position: number;
  navigation_id: number;
  full_path: string;
}

interface PageEditorProps {
  page: Page;
  navigationId: number;
}

export default function PageEditor({ page, navigationId }: PageEditorProps) {
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content || '');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTitle(page.title);
    setContent(page.content || '');
    setHasChanges(false);
  }, [page.id]);

  useEffect(() => {
    const changed =
      title !== page.title ||
      content !== (page.content || '');
    setHasChanges(changed);
  }, [title, content, page]);

  const handleSave = () => {
    router.patch(`/admin/navigations/${navigationId}/pages/${page.id}`, {
      title,
      content
    }, {
      preserveScroll: true
    });
    setHasChanges(false);
  };

  const handleBack = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to go back?')) {
        router.visit(`/admin/navigations/${navigationId}/pages`);
      }
    } else {
      router.visit(`/admin/navigations/${navigationId}/pages`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
      backgroundColor: 'white',
      border: '2px solid #ddd'
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderBottom: '2px solid #ddd',
        padding: '8px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <button
          onClick={handleBack}
          style={{
            padding: '4px 12px',
            border: '1px solid var(--color-base-300)',
            background: 'var(--color-base-100)',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back to Pages
        </button>
        <div style={{ fontWeight: 'bold' }}>
          Edit Page
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          style={{
            padding: '4px 12px',
            border: '1px solid var(--color-primary)',
            background: hasChanges ? 'var(--color-primary)' : 'var(--color-base-300)',
            color: 'white',
            cursor: hasChanges ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            opacity: hasChanges ? 1 : 0.6
          }}
        >
          Save {hasChanges && '*'}
        </button>
      </div>

      {/* Form Fields */}
      <div style={{
        padding: '12px',
        borderBottom: '1px solid #ddd',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid var(--color-base-300)',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            Slug
          </label>
          <input
            type="text"
            value={page.slug}
            readOnly
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid var(--color-base-300)',
              fontSize: '14px',
              fontFamily: 'monospace',
              backgroundColor: 'var(--color-base-200)',
              cursor: 'not-allowed',
              opacity: 0.8
            }}
            title="Auto-generated from page title"
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            Full Path
          </label>
          <div style={{
            padding: '8px',
            backgroundColor: 'var(--color-base-100)',
            border: '1px solid var(--color-base-300)',
            fontSize: '14px',
            fontFamily: 'monospace',
            color: 'var(--color-base-content)',
            opacity: 0.7
          }}>
            {page.full_path}
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflow: 'hidden'
      }}>
        <AttachementContentPreview
          content={content}
          onChange={setContent}
        />
      </div>
    </div>
  );
}
