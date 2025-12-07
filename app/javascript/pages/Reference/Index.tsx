import { Link } from "@inertiajs/react";
import ContentLayout from "../shared/ContentLayout";
import ReferenceCard from "./ReferenceCard";
import NavigationsDisplay from "./NavigationsDisplay";

interface NavigationItem {
  id: number;
  name: string;
  url: string;
  position: number;
  navigation_parent_id: number | null;
  children: NavigationItem[];
  pages: PageItem[];
  full_path: string;
}

export interface PageItem {
  id: number;
  title: string;
  slug: string;
  position: number;
  navigation_id: number;
  full_path: string;
}

interface Breadcrumb {
  label: string;
  href: string | null;
}

interface ReferenceIndexProps {
  navigations: NavigationItem[];
  homePageData: any;
  breadcrumbs: Breadcrumb[];
}

export default function ReferenceIndex({ navigations, homePageData, breadcrumbs }: ReferenceIndexProps) {
  const renderBreadcrumbs = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    return (
      <div className="breadcrumbs text-sm">
        <ul>
          {breadcrumbs.map((crumb, index) => (
            <li key={index}>
              {crumb.href ? (
                <Link href={crumb.href} className="link link-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <ContentLayout
      homePageData={homePageData}
      breadcrumbs={renderBreadcrumbs()}
    >
      <div style={{
        padding: '0 16px',
        maxWidth: '1000px',
      }}>
        <div className="card shadow-xl" style={{ backgroundColor: '#f9fafb', borderRadius: 0 }}>
          <div className="card-body" style={{ padding: '16px' }}>

            <header style={{
              marginBottom: '40px',
            }}>
              <h1 className="text-4xl md:text-5xl font-bold" style={{
                lineHeight: '1.2',
                color: '#1f2937',
              }}>
                Reference
              </h1>
            </header>

            <NavigationsDisplay
            />

          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
