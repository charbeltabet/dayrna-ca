import HomeContext from "../Home/context";
import NavigationBar from "../NavigationBar";
import TopRibon from "../TopRibon";

interface ContentLayoutProps {
  homePageData: any;
  breadcrumbs?: React.ReactNode;
  footerNavigation?: React.ReactNode;
  children: React.ReactNode;
}

export default function ContentLayout({
  homePageData,
  breadcrumbs,
  footerNavigation,
  children
}: ContentLayoutProps) {
  return (
    <HomeContext.Provider value={{ homePageData }}>
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <TopRibon />
        <NavigationBar />
        <div className="bg-base-100" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {breadcrumbs && (
            <div className="bg-base-100" style={{
              padding: '0px 16px',
              maxWidth: '1000px',
              borderBottom: '1px solid #e5e7eb',
            }}>
              {breadcrumbs}
            </div>
          )}

          <div
            id="main-scroll-container"
            style={{
              flex: 1,
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            {children}
          </div>

          {footerNavigation && (
            <div className="bg-base-100" style={{
              padding: '4px 16px',
              maxWidth: '1000px',
              borderTop: '1px solid #e5e7eb',
            }}>
              {footerNavigation}
            </div>
          )}
        </div>
      </div>
    </HomeContext.Provider>
  );
}
