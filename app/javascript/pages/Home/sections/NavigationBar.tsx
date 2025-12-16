import HomeContext from "../context";
import { useContext } from "react";
import { usePage } from "@inertiajs/react";

interface MenuItem {
  id: string;
  label: string;
  link: string;
  children: MenuItem[];
}

function MenuItemComponent({ item }: { item: MenuItem }) {
  const { url } = usePage();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = url === item.link || url.startsWith(item.link + '/');

  if (hasChildren) {
    return (
      <li>
        <details>
          <summary>
            <a href={item.link} className={isActive ? 'menu-active' : ''}>{item.label}</a>
          </summary>
          <ul>
            {item.children.map((child) => (
              <MenuItemComponent key={child.id} item={child} />
            ))}
          </ul>
        </details>
      </li>
    );
  }

  return (
    <li>
      <a href={item.link} className={isActive ? 'menu-active' : ''}>{item.label}</a>
    </li>
  );
}

export interface NavigationData {
  id: number;
  name: string;
  url: string;
  full_path: string;
  item_type: 'NAV' | 'PAGE' | 'MENU';
  external_link?: string;
  label?: string;
  children: NavigationData[];
  pages: PageData[];
}

interface PageData {
  id: number;
  title: string;
  slug: string;
  full_path: string;
}

function transformNavigationToMenuItem(nav: NavigationData): MenuItem {
  const children: MenuItem[] = [];

  // For MENU items, use label and external_link directly (no children)
  if (nav.item_type === 'MENU') {
    return {
      id: `menu-${nav.id}`,
      label: nav.label || nav.name,
      link: nav.external_link || nav.full_path,
      children: []
    };
  }

  // Add child navigations first
  if (nav.children && nav.children.length > 0) {
    nav.children.forEach(child => {
      children.push(transformNavigationToMenuItem(child));
    });
  }

  // Then add pages as leaves (only for NAV type)
  if (nav.pages && nav.pages.length > 0) {
    nav.pages.forEach(page => {
      children.push({
        id: `page-${page.id}`,
        label: page.title,
        link: page.full_path,
        children: []
      });
    });
  }

  return {
    id: `nav-${nav.id}`,
    label: nav.name,
    link: nav.full_path,
    children
  };
}

export default function NavigationBar() {
  const { homePageData } = useContext(HomeContext);
  const menuItems: MenuItem[] = homePageData?.header_menu || [];
  const navigations: NavigationData[] = homePageData?.navigations || [];

  // Transform navigations into menu items
  const navigationMenuItems = navigations.map(transformNavigationToMenuItem);

  // Combine menu items and navigation items
  const allMenuItems = [...menuItems, ...navigationMenuItems];
  console.log('homePageData?.navigations', homePageData?.navigations)

  return (
    <div style={{
      height: '70px',
      width: '100%',
      backgroundColor: 'var(--color-background)',
      display: 'flex',
      flexDirection: 'row',
      flexShrink: 0,
      zIndex: 999,
    }}>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <img
            src="/logo.png"
            style={{
              height: '60px',
            }}
          />
        </div>
        <div className="navbar-center">
          <ul className="menu bg-base-300 lg:menu-horizontal">
            {allMenuItems.map((item) => (
              <MenuItemComponent key={item.id} item={item} />
            ))}
          </ul>
        </div>
        <div className="navbar-end d-flex flex-row gap-2">
          <button className="btn btn-primary">
            Contact Us
          </button>
          {/* <button className="btn btn-info">
            Donate
          </button> */}
        </div>
      </div>
    </div>
  )
}
