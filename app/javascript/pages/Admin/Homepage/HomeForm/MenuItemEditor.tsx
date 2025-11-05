import React, { useState } from 'react';
import { MenuItem } from './useMenuEditor';

interface MenuItemEditorProps {
  items: MenuItem[];
  onUpdate: (id: string, updates: Partial<Omit<MenuItem, 'id' | 'children'>>) => void;
  onDelete: (id: string) => void;
  onAdd: (parentId?: string) => void;
  onMove: (id: string, direction: 'up' | 'down', parentId?: string) => void;
  parentId?: string;
  level?: number;
}

function MenuItemRow({
  item,
  onUpdate,
  onDelete,
  onAdd,
  onMove,
  parentId,
  level = 0,
  isFirst,
  isLast
}: {
  item: MenuItem;
  onUpdate: (id: string, updates: Partial<Omit<MenuItem, 'id' | 'children'>>) => void;
  onDelete: (id: string) => void;
  onAdd: (parentId?: string) => void;
  onMove: (id: string, direction: 'up' | 'down', parentId?: string) => void;
  parentId?: string;
  level: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div>
      <div
        style={{
          backgroundColor: 'var(--color-base-100)',
          border: '1px solid var(--color-base-300)',
          padding: '12px',
          marginBottom: '8px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
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

          <input
            type="text"
            value={item.label}
            onChange={(e) => onUpdate(item.id, { label: e.target.value })}
            placeholder="Label"
            style={{
              flex: '1',
              padding: '6px 10px',
              border: '1px solid var(--color-base-300)',
              fontSize: '14px'
            }}
          />

          <input
            type="text"
            value={item.link}
            onChange={(e) => onUpdate(item.id, { link: e.target.value })}
            placeholder="Link (e.g., /about)"
            style={{
              flex: '1',
              padding: '6px 10px',
              border: '1px solid var(--color-base-300)',
              fontSize: '14px'
            }}
          />

          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => onMove(item.id, 'up', parentId)}
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
              onClick={() => onMove(item.id, 'down', parentId)}
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

            <button
              onClick={() => onAdd(item.id)}
              style={{
                padding: '4px 8px',
                border: '1px solid var(--color-base-300)',
                background: 'var(--color-primary)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              title="Add child item"
            >
              + Child
            </button>

            <button
              onClick={() => onDelete(item.id)}
              style={{
                padding: '4px 8px',
                border: '1px solid var(--color-error)',
                background: 'var(--color-error)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              title="Delete item"
            >
              Delete
            </button>
          </div>
        </div>

        {isExpanded && item.children.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <MenuItemEditor
              items={item.children}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAdd={onAdd}
              onMove={onMove}
              parentId={item.id}
              level={level + 1}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function MenuItemEditor({
  items,
  onUpdate,
  onDelete,
  onAdd,
  onMove,
  parentId,
  level = 0
}: MenuItemEditorProps) {
  if (items.length === 0) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-base-content)' }}>
        <p style={{ marginBottom: '12px', opacity: 0.7 }}>No menu items yet</p>
        <button
          onClick={() => onAdd(parentId)}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--color-primary)',
            background: 'var(--color-primary)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          + Add Menu Item
        </button>
      </div>
    );
  }

  return (
    <div>
      {items.map((item, index) => (
        <MenuItemRow
          key={item.id}
          item={item}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAdd={onAdd}
          onMove={onMove}
          parentId={parentId}
          level={level}
          isFirst={index === 0}
          isLast={index === items.length - 1}
        />
      ))}

      {level === 0 && (
        <button
          onClick={() => onAdd(parentId)}
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
          + Add Menu Item
        </button>
      )}
    </div>
  );
}
