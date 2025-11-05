import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  }) as T;
}

// Debounced router visit with 300ms delay
const debouncedRouterVisit = debounce((path: string, options: any) => {
  router.visit(path, options);
}, 300);

interface Header {
  name: string;
  label: string;
  renderCell?: (row: any) => any;
  renderCellActions?: (row: any) => any;
}

interface AttachmentGroupsTableProps {
  headers: Header[];
  data: any[];
  groupsCount?: number;
  onSortChange: (columnName: string, direction: 'asc' | 'desc' | null) => void;
  highlightedRowId?: number | null;
  searchQuery?: string | null;
}

export default function AttachmentGroupsTable({
  headers,
  data,
  groupsCount,
  onSortChange,
  highlightedRowId,
  searchQuery = ''
}: AttachmentGroupsTableProps) {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync local search query with prop
  useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  // Handle search with debounced navigation
  const handleSearch = (query: string) => {
    setLocalSearchQuery(query);

    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('query', query);
    } else {
      url.searchParams.delete('query');
    }

    debouncedRouterVisit(url.pathname + url.search, {
      preserveState: true,
      only: ['attachment_groups']
    });
  };

  // Handle "/" key press to focus search input and Escape to blur
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Focus search input on "/" key press
      if (e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Blur search input on Escape key press
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? data : [];
    setSelectedRows(newSelected);
  };

  // Handle individual row selection
  const handleRowSelect = (row: any, checked: boolean) => {
    const newSelected = checked
      ? [...selectedRows, row]
      : selectedRows.filter(r => r.id !== row.id);
    setSelectedRows(newSelected);
  };

  // Handle column sort
  const handleSort = (columnName: string) => {
    let newDirection: 'asc' | 'desc' | null = 'asc';

    if (sortColumn === columnName) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newDirection = null;
      }
    }

    setSortColumn(newDirection ? columnName : null);
    setSortDirection(newDirection);
    onSortChange(columnName, newDirection);
  };

  // Handle bulk delete
  const handleBulkDelete = (selectedRows: any[]) => {
    const count = selectedRows.length;
    const message = count === 1
      ? `Are you sure you want to delete 1 group? This action cannot be undone.`
      : `Are you sure you want to delete ${count} groups? This action cannot be undone.`;

    if (window.confirm(message)) {
      const ids = selectedRows.map(row => row.id);
      router.delete('/admin/attachments/groups', {
        data: { id: ids },
        onFinish: () => {
          setSelectedRows([]);
        }
      });
    }
  };

  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <div
      className="hidden-scrollbar"
      style={{
        overflowX: 'hidden',
        overflowY: 'scroll',
        height: '100%',
        border: '1px solid #ddd',
        position: 'relative'
      }}
    >
      <div style={{
        padding: '4px',
        width: '100%',
        backgroundColor: 'white',
        borderBottom: '2px solid #ddd',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <span style={{
            fontWeight: 'bold',
            marginRight: '8px'
          }}>
            Groups
          </span>
          <span className="text-sm" style={{
            marginRight: '8px'
          }}>
            {groupsCount} group{groupsCount === 1 ? '' : 's'}
          </span>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '4px',
        }}>
          <Link
            className="link link-primary"
            style={{ cursor: 'pointer' }}
            href="/admin/attachments"
            preserveState={true}
          >
            <button
              className="btn btn-primary"
            >
              Attachments
            </button>
          </Link>
          <Link
            className="link link-primary"
            style={{ cursor: 'pointer' }}
            href="/admin/attachments/groups"
            preserveState={true}
            only={['previewed_group']}
          >
            <button
              className="btn btn-primary"
            >
              New
            </button>
          </Link>
        </div>
      </div>
      {selectedRows.length === 0 ? (
        <div style={{
          padding: '4px',
          backgroundColor: 'white',
          borderBottom: '1px solid #ddd',
        }}>
          <label className="input">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="search"
              className="grow"
              placeholder="Search"
              ref={searchInputRef}
              value={localSearchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <kbd className="kbd kbd-sm">/</kbd>
          </label>
        </div>
      ) : (
        <div style={{
          padding: '12px',
          backgroundColor: '#f0f0f0',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ fontWeight: 'bold', flex: 1 }}>
            {selectedRows.length} item{selectedRows.length === 1 ? '' : 's'} selected
          </span>
          <button
            className="btn btn-sm btn-error"
            onClick={() => handleBulkDelete(selectedRows)}
          >
            Delete
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => {
              setSelectedRows([]);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      <div style={{
        overflowX: 'scroll',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              {/* Select all checkbox */}
              <th style={{
                width: '50px',
                padding: '12px',
                borderRight: '2px solid #ddd',
                textAlign: 'center',
                position: 'sticky',
                left: 0,
                backgroundColor: '#f5f5f5',
                zIndex: 30,
                boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
              }}>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    style={{ cursor: 'pointer', borderRadius: '0px' }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </label>
              </th>

              {/* Column headers with sort arrows */}
              {headers.map((header) => (
                <th
                  key={header.name}
                  style={{
                    padding: '12px',
                    borderRight: '1px solid #ddd',
                    textAlign: 'left',
                    fontWeight: 'bold'
                  }}
                >
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                    onClick={() => handleSort(header.name)}
                  >
                    <span>{header.label}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                      <svg
                        style={{
                          width: '12px',
                          height: '12px',
                          fill: sortColumn === header.name && sortDirection === 'asc' ? '#570df8' : '#ccc'
                        }}
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg
                        style={{
                          width: '12px',
                          height: '12px',
                          marginTop: '-4px',
                          fill: sortColumn === header.name && sortDirection === 'desc' ? '#570df8' : '#ccc'
                        }}
                        viewBox="0 0 20 20"
                      >
                        <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </button>
                </th>
              ))}

              {/* Actions column header */}
              {headers.some(h => h.renderCellActions) && (
                <th style={{
                  width: '80px',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  position: 'sticky',
                  right: 0,
                  backgroundColor: '#f5f5f5',
                  zIndex: 30,
                  borderLeft: '2px solid #ddd',
                  boxShadow: '-2px 0 4px rgba(0,0,0,0.1)'
                }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => {
              const isSelected = selectedRows.some(r => r.id === row.id);
              const isHighlighted = highlightedRowId === row.id;

              const rowBackgroundColor = (() => {
                if (isSelected) return '#e0d4fc';
                if (isHighlighted) return '#fff4e5';
                return index % 2 === 0 ? '#fff' : '#fafafa';
              })()

              return (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: rowBackgroundColor,
                    borderBottom: '1px solid #ddd'

                  }}
                  onMouseEnter={(e) => {
                    if (isHighlighted) return;
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#f0f0f0';
                      // Update sticky cells background on hover
                      const cells = e.currentTarget.querySelectorAll('td');
                      cells.forEach((cell: any) => {
                        if (cell.style.position === 'sticky') {
                          cell.style.backgroundColor = '#f0f0f0';
                        }
                      });
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isHighlighted) return;
                    if (!isSelected) {
                      const bgColor = index % 2 === 0 ? '#fff' : '#fafafa';
                      e.currentTarget.style.backgroundColor = bgColor;
                      // Restore sticky cells background on hover leave
                      const cells = e.currentTarget.querySelectorAll('td');
                      cells.forEach((cell: any) => {
                        if (cell.style.position === 'sticky') {
                          cell.style.backgroundColor = bgColor;
                        }
                      });
                    }
                  }}
                >
                  {/* Row checkbox */}
                  <td style={{
                    padding: '12px',
                    borderRight: '2px solid #ddd',
                    textAlign: 'center',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: rowBackgroundColor,
                    zIndex: 9,
                    boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                  }}>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        style={{ cursor: 'pointer', borderRadius: '0px' }}
                        checked={isSelected}
                        onChange={(e) => handleRowSelect(row, e.target.checked)}
                      />
                    </label>
                  </td>

                  {/* Data cells */}
                  {headers.map((header) => (
                    <td key={header.name} style={{ padding: '12px', borderRight: '1px solid #ddd' }}>
                      {header.renderCell ? header.renderCell(row) : row[header.name]}
                    </td>
                  ))}

                  {/* Actions dropdown */}
                  {headers.some(h => h.renderCellActions) && (
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      position: 'sticky',
                      right: 0,
                      backgroundColor: isSelected ? '#e0d4fc' : (index % 2 === 0 ? '#fff' : '#fafafa'),
                      zIndex: 9,
                      borderLeft: '2px solid #ddd',
                      boxShadow: '-2px 0 4px rgba(0,0,0,0.1)'
                    }}>
                      {headers.find(h => h.renderCellActions)?.renderCellActions && (
                        <div style={{ position: 'relative', zIndex: 100 }}>
                          {headers.find(h => h.renderCellActions)?.renderCellActions?.(row)}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
          No data available
        </div>
      )}
    </div>
  );
}
