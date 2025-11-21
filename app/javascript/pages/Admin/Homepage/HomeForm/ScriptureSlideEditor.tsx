import { useState } from 'react';
import { ScriptureSlide } from './useScriptureSlideEditor';
import ImageSelector from './ImageSelector';

interface ScriptureSlideEditorProps {
  slides: ScriptureSlide[];
  onUpdate: (id: string, updates: Partial<Omit<ScriptureSlide, 'id'>>) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

function ScriptureSlideRow({
  slide,
  onUpdate,
  onDelete,
  onMove,
  isFirst,
  isLast
}: {
  slide: ScriptureSlide;
  onUpdate: (id: string, updates: Partial<Omit<ScriptureSlide, 'id'>>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        backgroundColor: 'var(--color-base-100)',
        border: '1px solid var(--color-base-300)',
        padding: '12px',
        marginBottom: '8px',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', marginBottom: isExpanded ? '12px' : '0', alignItems: 'center' }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '4px 8px'
          }}
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? '▼' : '▶'}
        </button>

        <div style={{ flex: 1, fontWeight: 'bold', fontSize: '14px' }}>
          {slide.reference || 'New Slide'}
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => onMove(slide.id, 'up')}
            disabled={isFirst}
            style={{
              padding: '4px 8px',
              border: '1px solid var(--color-base-300)',
              background: 'var(--color-base-100)',
              cursor: isFirst ? 'not-allowed' : 'pointer',
              opacity: isFirst ? 0.5 : 1,
              fontSize: '12px',
            }}
            title="Move up"
          >
            ↑
          </button>

          <button
            onClick={() => onMove(slide.id, 'down')}
            disabled={isLast}
            style={{
              padding: '4px 8px',
              border: '1px solid var(--color-base-300)',
              background: 'var(--color-base-100)',
              cursor: isLast ? 'not-allowed' : 'pointer',
              opacity: isLast ? 0.5 : 1,
              fontSize: '12px',
            }}
            title="Move down"
          >
            ↓
          </button>

          <button
            onClick={() => onDelete(slide.id)}
            style={{
              padding: '4px 8px',
              border: '1px solid var(--color-error)',
              background: 'var(--color-error)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Delete slide"
          >
            Delete
          </button>
        </div>
      </div>

      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <ImageSelector
              value={slide.selectedImage}
              onChange={(selected) => {
                onUpdate(slide.id, {
                  selectedImage: selected,
                  record_attachment_id: selected?.value || null
                });
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>
              Scripture Text
            </label>
            <textarea
              value={slide.scriptureText}
              onChange={(e) => onUpdate(slide.id, { scriptureText: e.target.value })}
              placeholder="Enter the scripture text..."
              rows={3}
              style={{
                width: '100%',
                padding: '6px 10px',
                border: '1px solid var(--color-base-300)',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px' }}>
              Reference
            </label>
            <input
              type="text"
              value={slide.reference}
              onChange={(e) => onUpdate(slide.id, { reference: e.target.value })}
              placeholder="John 3:16"
              style={{
                width: '100%',
                padding: '6px 10px',
                border: '1px solid var(--color-base-300)',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScriptureSlideEditor({
  slides,
  onUpdate,
  onDelete,
  onAdd,
  onMove
}: ScriptureSlideEditorProps) {
  if (slides.length === 0) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-base-content)' }}>
        <p style={{ marginBottom: '12px', opacity: 0.7 }}>No scripture slides yet</p>
        <button
          onClick={onAdd}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--color-primary)',
            background: 'var(--color-primary)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          + Add Slide
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '8px',
    }}>
      {slides.map((slide, index) => (
        <ScriptureSlideRow
          key={slide.id}
          slide={slide}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMove={onMove}
          isFirst={index === 0}
          isLast={index === slides.length - 1}
        />
      ))}

      <button
        onClick={onAdd}
        style={{
          padding: '8px 16px',
          border: '1px solid var(--color-primary)',
          background: 'var(--color-primary)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          width: '100%',
          marginTop: '8px'
        }}
      >
        + Add Slide
      </button>
    </div>
  );
}
