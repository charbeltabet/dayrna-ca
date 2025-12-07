import AdminLayout from "../Attachments/AdminLayout";
import HomePreview from "./HomePreview";
import HomeForm from "./HomeForm";
import { useState } from "react";

interface HomepageIndexProps {
  home_page_data: any;
  attachment_groups: any;
}

export default function HomepageIndex({ home_page_data, attachment_groups }: HomepageIndexProps) {
  const [homePageData, setHomePageData] = useState(home_page_data || {})
  const [initialData] = useState(home_page_data || {})

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
            homePageData={homePageData}
            setHomePageData={setHomePageData}
            initialData={initialData}
          />
        </div>
        <div
          style={{
            flex: 1,
            width: '50%',
          }}
        >
          <HomePreview
            homePageData={homePageData}
            attachment_groups={attachment_groups}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
