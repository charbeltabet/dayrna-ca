import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface FactItemProps {
  icon: IconDefinition;
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}

export default function FactItem({ icon, title, children }: FactItemProps) {
  return (
    <div style={{
      flex: 1,
      // borderRight: isLast ? 'none' : '1px solid var(--color-neutral)',
      padding: '5px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      justifyContent: 'space-between',
      border: '1px solid var(--color-base-300)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
      }}>
        <FontAwesomeIcon
          icon={icon}
          style={{
            fontSize: '24px',
            color: 'var(--color-primary)',
            flexShrink: 0,
          }}
        />
        <h3 className="text-xl font-bold" style={{
          margin: 0,
          color: 'var(--color-neutral)'
        }}>
          {title}
        </h3>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        gap: '6px',
      }}>
        <div style={{
          color: 'var(--color-base-content)',
          fontSize: '14px',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
