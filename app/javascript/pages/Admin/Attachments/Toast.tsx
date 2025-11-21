import { toast } from "sonner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleXmark,
  faCircleInfo,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

interface ToastProps {
  id: string | number;
  message?: string;
  level?: 'success' | 'error' | 'info' | 'warning';
}

export default function Toast({
  id,
  message,
  level = 'success'
}: ToastProps) {
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b',
  };

  const icons = {
    success: faCircleCheck,
    error: faCircleXmark,
    info: faCircleInfo,
    warning: faTriangleExclamation,
  };

  const backgroundColor = colors[level] || colors.info;

  return (
    <div
      style={{
        width: '400px',
        maxWidth: '90vw',
        backgroundColor,
        border: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: '12px',
        }}>
          <div style={{
            width: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}>
            <FontAwesomeIcon icon={icons[level]} size="lg" />
          </div>
          <span style={{
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '1.5',
          }}>
            {message}
          </span>
        </div>
        <button
          onClick={() => toast.dismiss(id)}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            marginLeft: '12px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
