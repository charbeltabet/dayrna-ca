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
const debounceQueryVisit = debounce((query: string) => {
  router.visit('', {
    data: {
      query
    },
    preserveState: true,
    preserveScroll: true
  })
}, 300);

interface Header {
  name: string;
  label: string;
  renderCell?: (row: any) => any;
  renderCellActions?: (row: any) => any;
  headerStyles?: React.CSSProperties;
}

interface AttachmentsTableProps {
  headers: Header[];
  data: any[];
  filesCount?: number;
  byteSize?: string;
  onSortChange: (columnName: string, direction: 'asc' | 'desc' | null) => void;
  highlightedRowId?: number | null;
  searchQuery?: string | null;
  mode?: 'attachments' | 'group-attachments';
  groupId?: number;
  onlyParam?: string;
  title?: string;
  searchKbd?: string;
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc' | null;
}

export default function AttachmentsTable({
  headers,
  data,
  filesCount,
  byteSize,
  onSortChange,
  highlightedRowId,
  searchQuery = '',
  mode = 'attachments',
  groupId,
  onlyParam = 'attachments',
  title = 'Attachments',
  searchKbd = '/',
  sortColumn: initialSortColumn = null,
  sortDirection: initialSortDirection = null
}: AttachmentsTableProps) {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(initialSortColumn);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(initialSortDirection);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync sort state with props
  useEffect(() => {
    setSortColumn(initialSortColumn);
    setSortDirection(initialSortDirection);
  }, [initialSortColumn, initialSortDirection]);

  // Handle searchKbd key press to focus search input and Escape to blur
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Focus search input on searchKbd key press
      if (e.key === searchKbd &&
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
  }, [searchKbd]);

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
      ? `Are you sure you want to delete 1 attachment? This action cannot be undone.`
      : `Are you sure you want to delete ${count} attachments? This action cannot be undone.`;

    if (window.confirm(message)) {
      const ids = selectedRows.map(row => row.id);
      router.delete('/admin/attachments', {
        data: { ids: ids },
        preserveState: true,
        onFinish: () => {
          setSelectedRows([]);
        }
      });
    }
  };

  // Handle bulk associate (for group mode)
  const handleBulkAssociate = () => {
    const attachment_ids = selectedRows.map(row => row.id);
    const count = attachment_ids.length;

    if (window.confirm(`Associate ${count} attachment${count === 1 ? '' : 's'} to this group?`)) {
      router.post(`/admin/attachments/groups/${groupId}/associate`, {
        attachment_ids
      }, {
        preserveState: true,
        only: [onlyParam, 'attachment_groups'],
        onFinish: () => {
          setSelectedRows([]);
        }
      });
    }
  };

  // Handle bulk disassociate (for group mode)
  const handleBulkDisassociate = () => {
    const attachment_ids = selectedRows.map(row => row.id);
    const count = attachment_ids.length;

    if (window.confirm(`Disassociate ${count} attachment${count === 1 ? '' : 's'} from this group?`)) {
      router.post(`/admin/attachments/groups/${groupId}/disassociate`, {
        attachment_ids
      }, {
        preserveState: true,
        only: [onlyParam, 'attachment_groups'],
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      <div style={{
        padding: '4px 8px',
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
            {title}
          </span>
          {filesCount !== undefined && (
            <span className="text-sm" style={{
              marginRight: '8px'
            }}>
              {filesCount} {mode === 'group-attachments' ? 'total' : `file${filesCount === 1 ? '' : 's'}`}
            </span>
          )}
          {mode === 'group-attachments' && (
            <span className="text-sm" style={{
              marginRight: '8px',
              color: '#570df8'
            }}>
              {data.filter(a => a.in_group).length} in group
            </span>
          )}
          {byteSize && (
            <span className="text-sm" style={{
              marginRight: '8px'
            }}>
              {byteSize}
            </span>
          )}
        </div>
        {mode === 'attachments' && (
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
          }}>
            <Link
              className="link link-primary"
              style={{ cursor: 'pointer' }}
              href="/admin/attachments/groups"
              preserveState={true}
            >
              <button
                className="btn btn-sm btn-primary"
              >
                Groups
              </button>
            </Link>
            <Link
              className="link link-primary"
              style={{ cursor: 'pointer' }}
              href="/admin/attachments"
              preserveState={true}
              only={['previewed_attachment']}
            >
              <button
                className="btn btn-sm btn-primary"
              >
                New
              </button>
            </Link>
          </div>
        )}
      </div>
      {selectedRows.length === 0 ? (
        <div style={{
          padding: '4px',
          backgroundColor: 'white',
          borderBottom: '1px solid #ddd',
        }}>
          <label className="input input-sm">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="search"
              placeholder="Search"
              ref={searchInputRef}
              value={localSearchQuery}
              onChange={(e) => {
                const newQuery = e.target.value;
                setLocalSearchQuery(newQuery);
                debounceQueryVisit(newQuery);
              }}
            />
            <kbd className="kbd kbd-sm">{searchKbd}</kbd>
          </label>
        </div>
      ) : (
        <div style={{
          padding: '4px 8px',
          backgroundColor: '#f0f0f0',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span style={{ fontWeight: 'bold', flex: 1 }}>
            {selectedRows.length} item{selectedRows.length === 1 ? '' : 's'} selected
          </span>
          {mode === 'group-attachments' ? (
            <>
              <button
                className="btn btn-success"
                onClick={handleBulkAssociate}
              >
                Associate to Group
              </button>
              <button
                className="btn btn-error"
                onClick={handleBulkDisassociate}
              >
                Disassociate from Group
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-sm"
                onClick={() => {
                  const urls = selectedRows.map(row => row.public_url).join('\n');
                  navigator.clipboard.writeText(urls).then(() => {
                    alert('URLs copied to clipboard!');
                  }).catch((err) => {
                    console.error('Failed to copy URLs:', err);
                    alert('Failed to copy URLs to clipboard');
                  });
                }}
              >
                Copy URLs
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => handleBulkDelete(selectedRows)}
              >
                Delete
              </button>
            </>
          )}
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setSelectedRows([]);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      <div
        className="hidden-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          minHeight: 0
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'separate' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
            <tr style={{
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid #ddd',
            }}>
              {/* Select all checkbox */}
              <th style={{
                width: '50px',
                padding: '12px',
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
                    textAlign: 'left',
                    fontWeight: 'bold',
                    ...header.headerStyles
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
              const inGroup = mode === 'group-attachments' && row.in_group;

              // const rowBackgroundColor = isSelected ? '#e0d4fc' : (index % 2 === 0 ? '#fff' : '#fafafa')
              const rowBackgroundColor = (() => {
                if (isSelected) return '#e0d4fc';
                if (isHighlighted) return '#fff4e5';
                if (inGroup) return '#e6f3ff';
                return index % 2 === 0 ? '#fff' : '#fafafa';
              })()

              return (
                <tr
                  key={`table-row-${row.id}`}
                  style={{
                    backgroundColor: rowBackgroundColor,
                    borderBottom: '1px solid #ddd',
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
                    // borderRight: '2px solid #ddd',
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
                    <td key={header.name} style={{
                      padding: 0,
                      verticalAlign: 'top',
                    }}>
                      <div style={{
                        maxHeight: '50px',
                        overflowY: 'scroll',
                        padding: '2px'
                      }}>
                        {header.renderCell ? header.renderCell(row) : row[header.name]}
                      </div>
                    </td>
                  ))}

                  {/* Actions dropdown */}
                  {headers.some(h => h.renderCellActions) && (
                    <td style={{
                      padding: '8px 4px',
                      textAlign: 'center',
                      position: 'sticky',
                      right: 0,
                      backgroundColor: rowBackgroundColor,
                      zIndex: 9,
                      boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
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
