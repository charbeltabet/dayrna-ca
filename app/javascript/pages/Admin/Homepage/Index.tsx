import AdminLayout from "../Attachments/AdminLayout";
import HomePreview from "./HomePreview";
import HomeForm from "./HomeForm";
import { useRef } from "react";

interface HomepageIndexProps {
  home_page_data: any;
}

export default function HomepageIndex({ home_page_data }: HomepageIndexProps) {
  const homePreviewRef = useRef<HTMLDivElement>(null)

  return (
    <AdminLayout>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        minHeight: '100%',
      }}>
        <div style={{
          flex: 1,
          width: '50%',
          minHeight: '100%',
        }}>
          <HomeForm
            serverData={home_page_data || {}}
            homePreviewRef={homePreviewRef}
          />
        </div>
        <div
          style={{
            flex: 1,
            width: '50%',
          }}
        >
          <HomePreview
            ref={homePreviewRef}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
