import { faFolder, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemCard from "../shared/ItemCard";

interface ReferenceCardProps {
  type: 'navigation' | 'page';
  item: {
    id: number;
    name?: string;
    title?: string;
    full_path: string;
    image_url?: string | null;
    text_preview?: string;
    children?: any[];
    pages?: any[];
  };
}

export default function ReferenceCard({ type, item }: ReferenceCardProps) {
  const title = type === 'navigation' ? item.name : item.title;

  if (type === 'page') {
    return (
      <ItemCard href={item.full_path}>
        <ItemCard.Image src={item.image_url} fallbackIcon={faFile} />
        <ItemCard.Content>
          <ItemCard.Title>
            {title}
          </ItemCard.Title>
          {item.text_preview && (
            <ItemCard.Description>
              {item.text_preview}
            </ItemCard.Description>
          )}
          <ItemCard.Actions>
            <div></div>
            <button
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Read more
            </button>
          </ItemCard.Actions>
        </ItemCard.Content>
      </ItemCard>
    );
  }

  // For navigation items
  const childImages: string[] = [];

  // Collect images from child navigations and pages
  if (item.children) {
    item.children.forEach((child: any) => {
      if (child.pages) {
        child.pages.forEach((page: any) => {
          if (page.image_url && childImages.length < 4) {
            childImages.push(page.image_url);
          }
        });
      }
    });
  }

  if (item.pages) {
    item.pages.forEach((page: any) => {
      if (page.image_url && childImages.length < 4) {
        childImages.push(page.image_url);
      }
    });
  }

  // Collect child links for description
  const childLinks: Array<{ title: string; path: string }> = [];
  const maxVisibleLinks = 5;

  if (item.children) {
    item.children.forEach((child: any) => {
      childLinks.push({ title: child.name, path: child.full_path });
    });
  }

  if (item.pages) {
    item.pages.forEach((page: any) => {
      childLinks.push({ title: page.title, path: page.full_path });
    });
  }

  const visibleLinks = childLinks.slice(0, maxVisibleLinks);
  const hiddenCount = childLinks.length - maxVisibleLinks;

  return (
    <ItemCard href={item.full_path}>
      <ItemCard.Image>
        {childImages.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            height: '100%',
            width: '100%',
            gap: '2px',
            backgroundColor: 'var(--color-base-300)',
          }}>
            {[0, 1, 2, 3].map((index) => (
              childImages[index] ? (
                <div
                  key={index}
                  style={{
                    backgroundImage: `url(${childImages[index]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                />
              ) : (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'var(--color-base-200)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-base-content)',
                    opacity: 0.4,
                  }}
                >
                  <FontAwesomeIcon icon={faFile} size="lg" />
                </div>
              )
            ))}
          </div>
        ) : (
          <div style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'var(--color-base-300)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ItemCard.Image fallbackIcon={faFolder} />
          </div>
        )}
      </ItemCard.Image>
      <ItemCard.Content>
        <ItemCard.Title>
          {title}
        </ItemCard.Title>
        {childLinks.length > 0 && (
          <ItemCard.Description>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              {visibleLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  className="link link-primary"
                  style={{
                    fontSize: '15px',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {link.title}
                </a>
              ))}
              {hiddenCount > 0 && (
                <span style={{
                  fontSize: '15px',
                  color: 'var(--color-base-content)',
                  opacity: 0.6,
                }}>
                  ...and {hiddenCount} more
                </span>
              )}
            </div>
          </ItemCard.Description>
        )}
        <ItemCard.Actions>
          <div style={{
            fontSize: '13px',
            color: 'var(--color-base-content)',
            opacity: 0.7,
          }}>
            {childLinks.length} {childLinks.length === 1 ? 'item' : 'items'}
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Browse
          </button>
        </ItemCard.Actions>
      </ItemCard.Content>
    </ItemCard>
  );
}
