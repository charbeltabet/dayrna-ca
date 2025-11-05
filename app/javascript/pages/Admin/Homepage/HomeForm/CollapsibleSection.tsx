import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  description?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = false,
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      style={{
        border: '1px solid var(--color-neutral)',
        backgroundColor: 'var(--color-base-100)',
      }}
    >
      {/* Section Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--color-base-content)',
        }}
      >
        <span
          style={{
            fontSize: '1rem',
            transition: 'transform 0.2s ease',
            display: 'inline-block',
          }}
        >
          {isExpanded ? '▼' : '▶'}
        </span>
        <div style={{ flex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '600',
            }}
          >
            {title}
          </h2>
          {description && (
            <p
              style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem',
                opacity: 0.7,
                fontWeight: 'normal',
              }}
            >
              {description}
            </p>
          )}
        </div>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div
          style={{
            padding: '0 1rem 1rem 1rem',
            borderTop: '1px solid var(--color-base-300)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
