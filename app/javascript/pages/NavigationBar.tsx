import HomeContext from "./Home/context";
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

export default function NavigationBar() {
  const { homePageData } = useContext(HomeContext);
  const menuItems: MenuItem[] = homePageData?.header_menu || [];

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
            {menuItems.map((item) => (
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
