import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { NavigationItem, Page, useNavigationEditor } from './useNavigationEditor';

interface PageItemRowProps {
  page: Page;
  navigationId: number;
  isFirst: boolean;
  isLast: boolean;
  onDelete: (navigationId: number, pageId: number) => void;
  onMove: (navigationId: number, pageId: number, direction: 'up' | 'down') => void;
  level: number;
  hasTreeLine: boolean;
  selectedPageId?: number;
}

function PageItemRow({
  page,
  navigationId,
  isFirst,
  isLast,
  onDelete,
  onMove,
  level,
  hasTreeLine,
  selectedPageId
}: PageItemRowProps) {
  const isActive = selectedPageId === page.id;

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start' }}>
      {/* Tree connector lines */}
      {hasTreeLine && (
        <div style={{
          position: 'absolute',
          left: `${level * 24 - 12}px`,
          top: 0,
          bottom: isLast ? '50%' : 0,
          width: '1px',
          backgroundColor: 'var(--color-base-300)'
        }} />
      )}
      {hasTreeLine && (
        <div style={{
          position: 'absolute',
          left: `${level * 24 - 12}px`,
          top: '50%',
          width: '12px',
          height: '1px',
          backgroundColor: 'var(--color-base-300)'
        }} />
      )}

      <div
        style={{
          marginLeft: `${level * 24}px`,
          flex: 1,
          backgroundColor: isActive ? 'var(--color-neutral)' : 'var(--color-base-50)',
          border: '1px solid var(--color-base-300)',
          padding: '8px 12px',
          marginBottom: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: isActive ? 1 : 0.95
        }}
      >
        {/* PAGE Badge */}
        <span style={{
          backgroundColor: 'var(--color-info)',
          color: 'white',
          padding: '2px 6px',
          fontSize: '10px',
          fontWeight: 'bold',
          borderRadius: '3px',
          flexShrink: 0
        }}>
          PAGE
        </span>

        {/* Page Title */}
        <span style={{ flex: 1, fontSize: '14px', color: isActive ? 'var(--color-white)' : 'inherit' }}>
          {page.title}
        </span>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => onMove(navigationId, page.id, 'up')}
            disabled={isFirst}
            style={{
              padding: '4px 8px',
              border: '1px solid var(--color-base-300)',
              background: 'var(--color-base-100)',
              cursor: isFirst ? 'not-allowed' : 'pointer',
              opacity: isFirst ? 0.5 : 1,
              fontSize: '11px'
            }}
            title="Move up"
          >
            ↑
          </button>

          <button
            onClick={() => onMove(navigationId, page.id, 'down')}
            disabled={isLast}
            style={{
              padding: '4px 8px',
              border: '1px solid var(--color-base-300)',
              background: 'var(--color-base-100)',
              cursor: isLast ? 'not-allowed' : 'pointer',
              opacity: isLast ? 0.5 : 1,
              fontSize: '11px'
            }}
            title="Move down"
          >
            ↓
          </button>

          <Link href={`/admin/navigations/${navigationId}/pages/${page.id}`}>
            <button
              style={{
                padding: '4px 8px',
                border: '1px solid var(--color-primary)',
                background: 'var(--color-primary)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Edit
            </button>
          </Link>

          <button
            onClick={() => onDelete(navigationId, page.id)}
            style={{
              padding: '4px 8px',
              border: '1px solid var(--color-error)',
              background: 'var(--color-error)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px'
            }}
            title="Delete page"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface NavigationItemRowProps {
  item: NavigationItem;
  onUpdate: (id: number, updates: Partial<Omit<NavigationItem, 'id' | 'children'>>) => void;
  onDelete: (id: number) => void;
  onAdd: (parentId?: number) => void;
  onMove: (id: number, direction: 'up' | 'down', parentId?: number) => void;
  onAddPage: (navigationId: number) => void;
  onDeletePage: (navigationId: number, pageId: number) => void;
  onMovePage: (navigationId: number, pageId: number, direction: 'up' | 'down') => void;
  parentId?: number;
  level: number;
  isFirst: boolean;
  isLast: boolean;
  selectedNavigationId?: number;
  selectedPageId?: number;
}

function NavigationItemRow({
  item,
  onUpdate,
  onDelete,
  onAdd,
  onMove,
  onAddPage,
  onDeletePage,
  onMovePage,
  parentId,
  level = 0,
  isFirst,
  isLast,
  selectedNavigationId,
  selectedPageId
}: NavigationItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children.length > 0 || item.pages.length > 0;
  const isActive = selectedNavigationId === item.id;

  return (
    <div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start' }}>
        {/* Tree connector lines */}
        {level > 0 && (
          <div style={{
            position: 'absolute',
            left: `${level * 24 - 12}px`,
            top: 0,
            bottom: isLast && !hasChildren ? '50%' : 0,
            width: '1px',
            backgroundColor: 'var(--color-base-300)'
          }} />
        )}
        {level > 0 && (
          <div style={{
            position: 'absolute',
            left: `${level * 24 - 12}px`,
            top: '50%',
            width: '12px',
            height: '1px',
            backgroundColor: 'var(--color-base-300)'
          }} />
        )}

        <div
          style={{
            marginLeft: `${level * 24}px`,
            flex: 1,
            backgroundColor: isActive ? 'var(--color-neutral)' : 'var(--color-base-100)',
            border: '1px solid var(--color-base-300)',
            padding: '12px',
            marginBottom: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Expand/Collapse Button */}
              {hasChildren && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '4px 8px',
                    flexShrink: 0
                  }}
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
              )}

              {/* NAV Badge */}
              <span style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '3px',
                flexShrink: 0,
                marginLeft: hasChildren ? '0' : '32px'
              }}>
                NAV
              </span>

              {/* Navigation Name (read-only display) */}
              <span style={{
                flex: 1,
                fontSize: '14px',
                fontWeight: '500',
                color: isActive ? 'var(--color-white)' : 'inherit'
              }}>
                {item.name}
              </span>

              {/* Slug display */}
              <span style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                color: isActive ? 'var(--color-white)' : 'var(--color-base-content)',
                opacity: 0.6,
                flexShrink: 0
              }}>
                /{item.url}
              </span>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={() => onMove(item.id, 'up', parentId)}
                disabled={isFirst}
                style={{
                  padding: '6px 10px',
                  border: '1px solid var(--color-base-300)',
                  background: 'var(--color-base-100)',
                  cursor: isFirst ? 'not-allowed' : 'pointer',
                  opacity: isFirst ? 0.5 : 1,
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                title="Move up"
              >
                ↑
              </button>

              <button
                onClick={() => onMove(item.id, 'down', parentId)}
                disabled={isLast}
                style={{
                  padding: '6px 10px',
                  border: '1px solid var(--color-base-300)',
                  background: 'var(--color-base-100)',
                  cursor: isLast ? 'not-allowed' : 'pointer',
                  opacity: isLast ? 0.5 : 1,
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                title="Move down"
              >
                ↓
              </button>

              <Link href={`/admin/navigations/${item.id}/pages`}>
                <button
                  style={{
                    padding: '6px 10px',
                    border: '1px solid var(--color-info)',
                    background: 'var(--color-info)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  title="Manage pages"
                >
                  Pages
                </button>
              </Link>

              <Link href={`/admin/navigations/${item.id}/pages`}>
                <button
                  style={{
                    padding: '6px 10px',
                    border: '1px solid var(--color-primary)',
                    background: 'var(--color-primary)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Edit
                </button>
              </Link>

              <button
                onClick={() => onAdd(item.id)}
                style={{
                  padding: '6px 10px',
                  border: '1px solid var(--color-primary)',
                  background: 'var(--color-primary)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                title="Add child section"
              >
                + Child Section
              </button>

              <button
                onClick={() => onDelete(item.id)}
                style={{
                  padding: '6px 10px',
                  border: '1px solid var(--color-error)',
                  background: 'var(--color-error)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                title="Delete navigation"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Children (navigations and pages) */}
      {isExpanded && hasChildren && (
        <div style={{ position: 'relative' }}>
          {/* Child Navigations */}
          {item.children.length > 0 && (
            <NavigationItemEditor
              items={item.children}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAdd={onAdd}
              onMove={onMove}
              onAddPage={onAddPage}
              onDeletePage={onDeletePage}
              onMovePage={onMovePage}
              parentId={item.id}
              level={level + 1}
              selectedNavigationId={selectedNavigationId}
              selectedPageId={selectedPageId}
            />
          )}

          {/* Pages */}
          {item.pages.length > 0 && item.pages.map((page, index) => (
            <PageItemRow
              key={page.id}
              page={page}
              navigationId={item.id}
              isFirst={index === 0}
              isLast={index === item.pages.length - 1}
              onDelete={onDeletePage}
              onMove={onMovePage}
              level={level + 1}
              hasTreeLine={level >= 0}
              selectedPageId={selectedPageId}
            />
          ))}

          {/* Add Page Button */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {level >= 0 && (
              <>
                <div style={{
                  position: 'absolute',
                  left: `${(level + 1) * 24 - 12}px`,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  backgroundColor: 'var(--color-base-300)',
                  opacity: 0.3
                }} />
                <div style={{
                  position: 'absolute',
                  left: `${(level + 1) * 24 - 12}px`,
                  top: '50%',
                  width: '12px',
                  height: '1px',
                  backgroundColor: 'var(--color-base-300)',
                  opacity: 0.3
                }} />
              </>
            )}
            <button
              onClick={() => onAddPage(item.id)}
              style={{
                marginLeft: `${(level + 1) * 24}px`,
                padding: '6px 12px',
                border: '1px dashed var(--color-info)',
                background: 'transparent',
                color: 'var(--color-info)',
                cursor: 'pointer',
                fontSize: '12px',
                marginBottom: '6px',
                width: 'calc(100% - ' + ((level + 1) * 24) + 'px)'
              }}
            >
              + Add Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface NavigationItemEditorProps {
  items: NavigationItem[];
  onUpdate: (id: number, updates: Partial<Omit<NavigationItem, 'id' | 'children'>>) => void;
  onDelete: (id: number) => void;
  onAdd: (parentId?: number) => void;
  onMove: (id: number, direction: 'up' | 'down', parentId?: number) => void;
  onAddPage: (navigationId: number) => void;
  onDeletePage: (navigationId: number, pageId: number) => void;
  onMovePage: (navigationId: number, pageId: number, direction: 'up' | 'down') => void;
  parentId?: number;
  level?: number;
  selectedNavigationId?: number;
  selectedPageId?: number;
}

function NavigationItemEditor({
  items,
  onUpdate,
  onDelete,
  onAdd,
  onMove,
  onAddPage,
  onDeletePage,
  onMovePage,
  parentId,
  level = 0,
  selectedNavigationId,
  selectedPageId
}: NavigationItemEditorProps) {
  if (items.length === 0) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-base-content)' }}>
        <p style={{ marginBottom: '12px', opacity: 0.7 }}>No navigation items yet</p>
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
          + Add Navigation Item
        </button>
      </div>
    );
  }

  return (
    <div>
      {items.map((item, index) => (
        <NavigationItemRow
          key={item.id}
          item={item}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAdd={onAdd}
          onMove={onMove}
          onAddPage={onAddPage}
          onDeletePage={onDeletePage}
          onMovePage={onMovePage}
          parentId={parentId}
          level={level}
          isFirst={index === 0}
          isLast={index === items.length - 1}
          selectedNavigationId={selectedNavigationId}
          selectedPageId={selectedPageId}
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
          + Add Navigation Item
        </button>
      )}
    </div>
  );
}

interface NavigationsListProps {
  selectedNavigationId?: number;
  selectedPageId?: number;
}

export default function NavigationsList({ selectedNavigationId, selectedPageId }: NavigationsListProps) {
  const { props } = usePage();
  const { navigations } = props as any;

  const {
    navigationItems,
    addNavigationItem,
    updateNavigationItem,
    deleteNavigationItem,
    moveNavigationItem,
    addPage,
    deletePage,
    movePage
  } = useNavigationEditor(navigations || []);

  return (
    <div style={{
      backgroundColor: 'white',
      height: '100%',
      border: '2px solid #ddd',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    }}>
      <div style={{
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderBottom: '2px solid #ddd',
        padding: '8px',
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div>
          Navigations & Pages
        </div>
      </div>
      <div style={{
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto',
        flex: 1,
        minHeight: 0,
      }}>
        <NavigationItemEditor
          items={navigationItems}
          onUpdate={updateNavigationItem}
          onDelete={deleteNavigationItem}
          onAdd={addNavigationItem}
          onMove={moveNavigationItem}
          onAddPage={addPage}
          onDeletePage={deletePage}
          onMovePage={movePage}
          level={0}
          selectedNavigationId={selectedNavigationId}
          selectedPageId={selectedPageId}
        />
      </div>
    </div>
  );
}
