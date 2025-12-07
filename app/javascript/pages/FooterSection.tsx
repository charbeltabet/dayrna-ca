import { faComments, faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Link } from "@inertiajs/react";
import HomeContext from "./Home/context";

interface Navigation {
  id: number;
  name: string;
  url: string;
  position: number;
  navigation_parent_id: number | null;
  full_path: string;
  item_type: 'NAV' | 'PAGE' | 'MENU';
  external_link?: string;
  label?: string;
  children?: Navigation[];
  pages?: Page[];
}

interface Page {
  id: number;
  title: string;
  slug: string;
  position: number;
  navigation_id: number;
  full_path: string;
  image_url?: string | null;
  text_preview?: string;
}

export default function FooterSection() {
  const { homePageData } = useContext(HomeContext);
  const topRibbon = homePageData?.top_ribbon || {};
  const navigations = homePageData?.navigations || [];

  // Sort navigations by position and limit to 100
  const sortedNavigations = [...navigations]
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .slice(0, 100);

  // Get up to 5 children (navigations or pages) for a navigation
  const getChildrenItems = (nav: Navigation) => {
    const children: Array<{ label: string; path: string }> = [];

    // Add child navigations first
    if (nav.children) {
      const sortedChildren = [...nav.children].sort((a, b) => (a.position || 0) - (b.position || 0));
      sortedChildren.forEach(child => {
        if (children.length < 5) {
          children.push({ label: child.name, path: child.full_path });
        }
      });
    }

    // Fill remaining slots with pages
    if (children.length < 5 && nav.pages) {
      const sortedPages = [...nav.pages].sort((a, b) => (a.position || 0) - (b.position || 0));
      sortedPages.forEach(page => {
        if (children.length < 5) {
          children.push({ label: page.title, path: page.full_path });
        }
      });
    }

    return children;
  };

  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
      <div>
        <img
          src="/logo.png"
          style={{
            height: '60px',
          }}
        />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          <p>Monastère et Paroisse St. Antoine - Outremont</p>
          {topRibbon.address && <p>{topRibbon.address}</p>}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px'
          }}>
            {topRibbon.phone && <p>{topRibbon.phone}</p>}
            {topRibbon.phone && topRibbon.email && <p>|</p>}
            {topRibbon.email && <p>{topRibbon.email}</p>}
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '4px',
        }}>
          <button className="btn btn-primary">
            Contact Us
            <FontAwesomeIcon icon={faComments} />
          </button>
          <button className="btn btn-info">
            Donate
            <FontAwesomeIcon icon={faHandHoldingDollar} />
          </button>
        </div>
      </div>

      {sortedNavigations.filter((n) => !n.external_link).map((nav: Navigation) => {
        const childrenItems = getChildrenItems(nav);
        const hasMoreItems = (nav.children?.length || 0) + (nav.pages?.length || 0) > 5;

        return (
          <nav key={nav.id}>
            <h6 className="footer-title">{nav.name}</h6>
            {childrenItems.map((child, index) => (
              <Link
                key={index}
                href={child.path}
                className="link link-hover"
              >
                {child.label}
              </Link>
            ))}
            {hasMoreItems && (
              <Link
                href={nav.full_path}
                className="link link-hover font-semibold"
              >
                View more
              </Link>
            )}
          </nav>
        );
      })}
    </footer>
  )
}
