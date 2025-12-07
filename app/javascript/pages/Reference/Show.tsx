import { Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ContentLayout from "../shared/ContentLayout";
import ReferenceCard from "./ReferenceCard";
import RichMarkdownContent from "../Announcements/RichMarkdownContent";
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

interface PageItem {
  id: number;
  title: string;
  slug: string;
  position: number;
  navigation_id: number;
  full_path: string;
  content?: string;
}

interface Breadcrumb {
  label: string;
  href: string | null;
}

interface ReferenceShowProps {
  type: 'navigation' | 'page' | 'not_found';
  navigation?: NavigationItem;
  page?: PageItem;
  path?: string;
  homePageData?: any;
  breadcrumbs?: Breadcrumb[];
  nextPage?: PageItem;
  previousPage?: PageItem;
  parentNavigation?: NavigationItem;
}

export default function ReferenceShow({ type, navigation, page, path, homePageData, breadcrumbs, nextPage, previousPage, parentNavigation }: ReferenceShowProps) {
  const renderBreadcrumbs = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    // For pages, show navigation arrows
    if (type === 'page' && (previousPage || nextPage)) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
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

          <div style={{
            display: 'flex',
            gap: '8px',
          }}>
            {previousPage && (
              <Link
                href={previousPage.full_path}
                className="btn btn-outline btn-primary btn-xs"
                title={previousPage.title}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </Link>
            )}
            {nextPage && (
              <Link
                href={nextPage.full_path}
                className="btn btn-outline btn-primary btn-xs"
                title={nextPage.title}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            )}
          </div>
        </div>
      );
    }

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

  if (type === 'not_found') {
    return (
      <ContentLayout homePageData={homePageData}>
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
        }}>
          <h1 className="text-4xl font-bold mb-4">Reference Not Found</h1>
          <p>The reference path "{path}" could not be found.</p>
        </div>
      </ContentLayout>
    );
  }

  const renderFooterNavigation = () => {
    if (type === 'navigation') {
      return (
        <></>
      )
    }

    if (type === 'page') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            {previousPage && (
              <Link
                href={previousPage.full_path}
                className="btn btn-outline btn-primary w-full justify-start"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                  <div className="truncate">{previousPage.title}</div>
                </div>
              </Link>
            )}
          </div>

          <div className="flex items-center justify-center">
            {parentNavigation && (
              <Link
                href={parentNavigation.full_path}
                className="btn btn-primary btn-sm"
              >
                View All in {parentNavigation.name}
              </Link>
            )}
          </div>

          <div>
            {nextPage && (
              <Link
                href={nextPage.full_path}
                className="btn btn-outline btn-primary w-full justify-end"
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                  <div className="truncate">{nextPage.title}</div>
                </div>
                <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            )}
          </div>
        </div>
      );
    }
  };

  if (type === 'page' && page) {
    return (
      <ContentLayout
        homePageData={homePageData}
        breadcrumbs={renderBreadcrumbs()}
        footerNavigation={renderFooterNavigation()}
      >
        <div style={{
          padding: '0 16px',
          maxWidth: '1000px',
        }}>
          <div className="card shadow-xl" style={{ backgroundColor: '#f9fafb', borderRadius: 0 }}>
            <div className="card-body" style={{ padding: '16px' }}>

              <article>
                <header style={{
                  marginBottom: '32px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid #e5e7eb',
                }}>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
                    lineHeight: '1.2',
                    color: '#1f2937',
                  }}>
                    {page.title}
                  </h1>
                </header>

                <div className="prose prose-lg max-w-none" style={{
                  lineHeight: '1.75',
                }}>
                  <RichMarkdownContent>
                    {page.content || ''}
                  </RichMarkdownContent>
                </div>
              </article>

            </div>
          </div>
        </div>
      </ContentLayout>
    );
  }

  if (type === 'navigation' && navigation) {
    return (
      <ContentLayout
        homePageData={homePageData}
        breadcrumbs={renderBreadcrumbs()}
        footerNavigation={renderFooterNavigation()}
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
                  {navigation.name}
                </h1>
              </header>


              <NavigationsDisplay
                customNavigationsData={navigation.children}
                customRootPages={navigation.pages}
              />

            </div>
          </div>
        </div>
      </ContentLayout>
    );
  }

  return null;
}
