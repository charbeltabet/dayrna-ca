import { usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AdminLayout from "../Attachments/AdminLayout";
import NavigationsList from "./NavigationsList";
import PagesList from "./PagesList";
import PageEditor from "./PageEditor";

export default function AdminNavigationsIndex() {
  const { props } = usePage();
  const { selectedNavigation, selectedPage } = props as any;
  const [navigationName, setNavigationName] = useState(selectedNavigation?.name || "");
  const [externalLink, setExternalLink] = useState(selectedNavigation?.external_link || "");

  // Sync navigationName and externalLink when selectedNavigation changes
  useEffect(() => {
    setNavigationName(selectedNavigation?.name || "");
    setExternalLink(selectedNavigation?.external_link || "");
  }, [selectedNavigation?.id, selectedNavigation?.name, selectedNavigation?.external_link]);

  const renderRightPanel = () => {
    // Show page editor if a specific page is selected
    if (selectedPage && selectedNavigation) {
      return (
        <PageEditor
          page={selectedPage}
          navigationId={selectedNavigation.id}
        />
      );
    }

    // Show pages list if a navigation is selected
    if (selectedNavigation) {
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
              {selectedNavigation.name}
            </div>
          </div>
          <div style={{
            padding: '12px',
            borderBottom: '1px solid #ddd',
            backgroundColor: '#fafafa',
          }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '4px',
            }}>
              Section Name
            </label>
            <input
              type="text"
              className="input input-sm input-bordered w-full"
              value={navigationName}
              onChange={(e) => setNavigationName(e.target.value)}
              onBlur={() => {
                if (navigationName !== selectedNavigation.name && navigationName.trim()) {
                  router.patch(`/admin/navigations/${selectedNavigation.id}`, {
                    name: navigationName.trim()
                  }, {
                    preserveScroll: true,
                    preserveState: true,
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              placeholder="Enter navigation name"
            />

            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '4px',
              marginTop: '12px',
            }}>
              Custom Link (Optional)
            </label>
            <input
              type="text"
              className="input input-sm input-bordered w-full"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              onBlur={() => {
                const trimmedLink = externalLink.trim();
                if (trimmedLink !== (selectedNavigation.external_link || '')) {
                  router.patch(`/admin/navigations/${selectedNavigation.id}`, {
                    external_link: trimmedLink || null
                  }, {
                    preserveScroll: true,
                    preserveState: true,
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              placeholder="https://example.com or /custom-path"
            />
            <small style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--color-base-content)',
              opacity: 0.7,
              marginTop: '4px',
            }}>
              If provided, this link will be used instead of /reference/...
            </small>
          </div>
          <div style={{
            overflowY: 'auto',
            flex: 1,
            minHeight: 0,
          }}>
            <PagesList
              pages={selectedNavigation.pages || []}
              navigationId={selectedNavigation.id}
            />
          </div>
        </div>
      );
    }

    // Default state - no navigation selected
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
          flexShrink: 0,
        }}>
          Pages
        </div>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-base-content)',
          opacity: 0.7,
          padding: '24px',
          textAlign: 'center'
        }}>
          Select a navigation and click "Pages" to manage its pages.
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div
          style={{
            flex: "1 0 0",
            minWidth: 0,
            overflowX: "hidden",
          }}
        >
          <NavigationsList
            selectedNavigationId={selectedNavigation?.id}
            selectedPageId={selectedPage?.id}
          />
        </div>
        <div
          style={{
            flex: "1.5 0 0",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {renderRightPanel()}
        </div>
      </div>
    </AdminLayout>
  );
}
