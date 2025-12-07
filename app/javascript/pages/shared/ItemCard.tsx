import { Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import React from "react";

interface ItemCardProps {
  href: string;
  children: React.ReactNode;
}

interface ItemCardImageProps {
  src?: string | null;
  fallbackIcon?: IconDefinition;
  children?: React.ReactNode;
}

interface ItemCardContentProps {
  children: React.ReactNode;
}

interface ItemCardTitleProps {
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
}

interface ItemCardDescriptionProps {
  children: React.ReactNode;
}

interface ItemCardMetaProps {
  children: React.ReactNode;
}

interface ItemCardActionsProps {
  children: React.ReactNode;
}

function ItemCard({ href, children }: ItemCardProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '200px',
          width: '100%',
          border: '1px solid var(--color-base-300)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-0.5px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.12)';
          e.currentTarget.style.borderColor = 'var(--color-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
          e.currentTarget.style.borderColor = 'var(--color-base-300)';
        }}
      >
        {children}
      </div>
    </Link>
  );
}

function ItemCardImage({ src, fallbackIcon, children }: ItemCardImageProps) {
  if (children) {
    // Custom content (e.g., 2x2 grid for navigations)
    return (
      <div style={{
        height: '100%',
        width: '35%',
        flexShrink: 0,
      }}>
        {children}
      </div>
    );
  }

  if (src) {
    return (
      <div style={{
        height: '100%',
        width: '35%',
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        aspectRatio: '1 / 1',
        backgroundPosition: 'center',
        flexShrink: 0,
      }} />
    );
  }

  return (
    <div style={{
      height: '100%',
      width: '35%',
      backgroundColor: 'var(--color-base-300)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {fallbackIcon && (
        <FontAwesomeIcon
          icon={fallbackIcon}
          style={{
            color: 'var(--color-primary)',
            fontSize: '96px',
            opacity: 0.7,
          }}
        />
      )}
    </div>
  );
}

function ItemCardContent({ children }: ItemCardContentProps) {
  return (
    <div style={{
      flex: 1,
      backgroundColor: 'var(--color-white)',
      display: 'flex',
      flexDirection: 'column',
      padding: '10px',
      gap: '12px',
    }}>
      {children}
    </div>
  );
}

function ItemCardTitle({ badge, badgeColor, children }: ItemCardTitleProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      {badge && (
        <span style={{
          backgroundColor: badgeColor || 'var(--color-primary)',
          color: 'white',
          padding: '2px 6px',
          fontSize: '10px',
          fontWeight: 'bold',
          borderRadius: '3px',
          flexShrink: 0,
        }}>
          {badge}
        </span>
      )}
      <h2 className="text-2xl font-bold" style={{
        margin: 0,
        color: 'var(--color-neutral)',
        lineHeight: '1.3',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {children}
      </h2>
    </div>
  );
}

function ItemCardDescription({ children }: ItemCardDescriptionProps) {
  return (
    <div style={{
      flex: 1,
      position: 'relative',
      color: 'var(--color-base-content)',
      fontSize: '14px',
      lineHeight: '1.6',
      overflow: 'hidden',
      minHeight: '40px',
    }}>
      <div style={{
        maxHeight: '100%',
        overflow: 'hidden',
      }}>
        {children}
      </div>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40px',
        background: 'linear-gradient(to bottom, transparent, var(--color-white))',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

function ItemCardMeta({ children }: ItemCardMetaProps) {
  return (
    <div>
      <p style={{
        fontSize: '13px',
        color: 'var(--color-base-content)',
        opacity: 0.7,
        margin: 0,
        fontWeight: 500,
      }}>
        {children}
      </p>
    </div>
  );
}

function ItemCardActions({ children }: ItemCardActionsProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
    }}>
      {children}
    </div>
  );
}

// Attach sub-components to main component
ItemCard.Image = ItemCardImage;
ItemCard.Content = ItemCardContent;
ItemCard.Title = ItemCardTitle;
ItemCard.Description = ItemCardDescription;
ItemCard.Meta = ItemCardMeta;
ItemCard.Actions = ItemCardActions;

export default ItemCard;
