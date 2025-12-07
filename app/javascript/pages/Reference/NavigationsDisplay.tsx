import { useContext } from "react";
import HomeContext from "../Home/context";
import { NavigationData } from "../NavigationBar";
import ReferenceCard from "./ReferenceCard";

export default function NavigationsDisplay({
  customNavigationsData,
  customRootPages
}: any) {
  const { homePageData } = useContext(HomeContext);
  const navigations: NavigationData[] = customNavigationsData || homePageData?.navigations || [];

  const rootNavigations = navigations || [];
  const rootPages = customRootPages || homePageData.root_pages || [];

  const hasNavigations = rootNavigations.length > 0;
  const hasPages = rootPages.length > 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '100%',
    }}>
      {hasNavigations && (
        <section>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '12px'
          }}>
            {rootNavigations.
              filter((n) => (!n.external_link)).
              map((nav) => (
                <ReferenceCard
                  key={nav.id}
                  type="navigation"
                  item={nav}
                />
              ))}
          </div>
        </section>
      )}

      {hasPages && (
        <section>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '12px'
          }}>
            {rootPages.map((page: any) => (
              <ReferenceCard
                key={page.id}
                type="page"
                item={page}
              />
            ))}
          </div>
        </section>
      )}

      {!hasNavigations && !hasPages && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--color-base-content)',
          opacity: 0.6,
        }}>
          <p>No reference materials available yet.</p>
        </div>
      )}
    </div>
  )
}
