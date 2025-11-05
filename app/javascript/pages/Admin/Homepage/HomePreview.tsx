import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState, useEffect } from "react";
import Home from "../../Home";

interface HomePreviewProps {
  homePageData: any;
}

export default function HomePreview({
  homePageData
}: HomePreviewProps) {
  const previewRef = useRef<any>(null)

  const targetWidth = 1980

  const [previewZoomLevel, setPreviewZoomLevel] = useState(1)
  useEffect(() => {
    if (!previewRef.current) return

    const previewWidth = previewRef.current?.offsetWidth
    const zoomLevel = previewWidth / targetWidth

    setPreviewZoomLevel(zoomLevel)
  }, [targetWidth])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      height: '100%',
    }}>
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '4px',
        }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="range"
            min={0}
            max={2}
            value={previewZoomLevel}
            step={0.1}
            className="range range-xs"
            onChange={(e) => setPreviewZoomLevel(parseFloat(e.target.value))}
          />
          <div>
            {(previewZoomLevel * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <div
        style={{
          border: '1px solid var(--color-neutral)',
          boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
          zoom: previewZoomLevel,
          overflow: 'auto',
          flex: 1,
          minHeight: 0,
        }}
        ref={previewRef}
      >
        <Home
          homePageData={homePageData}
        />
      </div>
    </div>
  )
}
