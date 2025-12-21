import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useRef, useEffect } from 'react';

interface ContainerProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  description?: string;
}

const Container: React.FC<ContainerProps> = ({
  title,
  children,
  defaultExpanded = false,
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    defaultExpanded ? undefined : 0
  );
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  // Watch for content size changes when expanded
  useEffect(() => {
    if (!isExpanded || !contentRef.current) return;

    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    // Use ResizeObserver to watch for content size changes
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    // Use MutationObserver to watch for DOM changes
    const mutationObserver = new MutationObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(contentRef.current);
    mutationObserver.observe(contentRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [isExpanded]);

  return (
    <div
      style={{
        border: '2px solid var(--color-base-300)',
        backgroundColor: 'var(--color-base-100)',
        overflow: 'hidden',
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
          backgroundColor: isExpanded ? 'var(--color-base-200)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--color-base-content)',
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
        <div style={{ flex: 1 }}>
          <h2
            className="text-lg font-bold"
            style={{
              margin: 0,
            }}
          >
            {title}
          </h2>
          {description && (
            <p
              style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem',
                color: 'var(--color-base-content)',
                opacity: 0.6,
                fontWeight: 'normal',
              }}
            >
              {description}
            </p>
          )}
        </div>
      </button>

      {/* Section Content with Animation */}
      <div
        style={{
          height: contentHeight,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <div
          ref={contentRef}
          style={{
            padding: '1rem',
            borderTop: '2px solid var(--color-base-300)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const CollapsibleSection = {
  Container
}
