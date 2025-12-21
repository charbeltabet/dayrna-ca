import { useState, useRef, useEffect } from 'react';
import { faArrowDown, faArrowUp, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ImageSelector from './ImageSelector';
import { FormField } from '../../../../components/FormField';

function ScriptureSlideRow({
  index,
  reference,
  scriptureText,
  selectedImage,
  onDelete,
  onMove,
  isFirst,
  isLast
}: {
  index: number;
  reference: string;
  scriptureText: string;
  selectedImage?: any;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | undefined>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <div
      style={{
        backgroundColor: 'var(--color-base-100)',
        border: '2px solid var(--color-base-300)',
        marginBottom: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: isExpanded ? 'var(--color-base-200)' : 'var(--color-base-200)',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background-color 0.2s ease',
        }}
      >
        <span
          style={{
            fontSize: '0.875rem',
            transition: 'transform 0.3s ease',
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.25rem',
            color: 'var(--color-primary)',
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </span>

        {selectedImage?.thumbnail_url && (
          <img
            src={selectedImage.thumbnail_url}
            alt={selectedImage.label || 'Scripture slide image'}
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'cover',
              border: '1px solid var(--color-base-300)',
            }}
          />
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {reference || 'New Slide'}
          </div>
          {scriptureText && (
            <div style={{ fontSize: '12px', opacity: 0.7, lineHeight: '1.4' }}>
              {scriptureText.substring(0, 100)}
              {scriptureText.length > 100 ? '...' : ''}
            </div>
          )}
        </div>

        <div
          style={{ display: 'flex', gap: '4px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => onMove('up')}
            disabled={isFirst}
            title="Move up"
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>

          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => onMove('down')}
            disabled={isLast}
            title="Move down"
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>

          <button
            type="button"
            className="btn btn-sm btn-error"
            onClick={onDelete}
            title="Delete slide"
          >
            Delete
          </button>
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        style={{
          height: contentHeight,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <FormField.Container
          ref={contentRef}
          style={{
            padding: '12px',
            borderTop: '2px solid var(--color-base-300)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <ImageSelector
            name={`scripture_slides.${index}.selectedImage`}
          />

          <FormField.Field
            name={`scripture_slides.${index}.scriptureText`}
            label="Scripture Text"
            placeholder="Enter the scripture text..."
            type="textarea"
            rows={3}
          />

          <FormField.Field
            name={`scripture_slides.${index}.reference`}
            label="Reference"
            placeholder="John 3:16"
          />
        </FormField.Container>
      </div>
    </div>
  );
}

export default function ScriptureSlideEditor() {
  const { control, watch } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "scripture_slides"
  });

  const addSlide = () => {
    append({
      record_attachment_id: null,
      scriptureText: '',
      reference: '',
      selectedImage: null
    });
  };

  if (fields.length === 0) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-base-content)' }}>
        <p style={{ marginBottom: '12px', opacity: 0.7 }}>No scripture slides yet</p>
        <button
          type="button"
          onClick={addSlide}
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
    <div>
      {fields.map((field, index) => {
        const reference = watch(`scripture_slides.${index}.reference`);
        const scriptureText = watch(`scripture_slides.${index}.scriptureText`);
        const selectedImage = watch(`scripture_slides.${index}.selectedImage`);
        return (
          <ScriptureSlideRow
            key={`scripture-slide-${index}-${field.id}`}
            index={index}
            reference={reference}
            scriptureText={scriptureText}
            selectedImage={selectedImage}
            onDelete={() => remove(index)}
            onMove={(direction) => {
              if (direction === 'up' && index > 0) {
                move(index, index - 1);
              } else if (direction === 'down' && index < fields.length - 1) {
                move(index, index + 1);
              }
            }}
            isFirst={index === 0}
            isLast={index === fields.length - 1}
          />
        );
      })}

      <button
        type="button"
        onClick={addSlide}
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