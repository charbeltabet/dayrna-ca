import { usePage } from "@inertiajs/react";
import { toast, Toaster } from "sonner";
import AdminNavigationBar from "./AdminNavigationBar";
import { useEffect } from "react";
import Toast from "./Toast";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const page = usePage();
  const { flash } = page.props

  useEffect(() => {
    if (!flash) return;

    Object.entries(flash).forEach(([level, message]) => {
      toast.custom((id) => (
        <Toast
          id={id}
          level={level as any}
          message={message as string}
        />
      ))
    })
  }, [flash]);

  return (
    <>
      <Toaster />
      <div
        style={{
          height: '100vh',
          width: '100vw',
          overflowX: 'hidden',
          overflowY: 'hidden'
        }}
      >
        <AdminNavigationBar />
        <div
          style={{
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            height: 'calc(100vh - 64px)',
            overflowY: 'scroll',
            backgroundColor: 'var(--color-base-300)'
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
