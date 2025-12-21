import { faArrowsRotate, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState, useEffect, useImperativeHandle } from "react";

interface HomePreviewProps {
  ref: any
}

export default function HomePreview({
  ref
}: HomePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const [targetVirtualWidth, setTargetVirtualWidth] = useState(1360)
  const [previewZoomLevel, setPreviewZoomLevel] = useState(1)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!previewRef.current) return

    // Use ResizeObserver to track container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        const height = entry.contentRect.height

        setContainerSize({ width, height })

        // Calculate zoom level to make virtual width = targetVirtualWidth
        const calculatedZoom = width / targetVirtualWidth
        setPreviewZoomLevel(calculatedZoom)
      }
    })

    resizeObserver.observe(previewRef.current)

    return () => resizeObserver.disconnect()
  }, [targetVirtualWidth])

  const iframeRef = useRef<HTMLIFrameElement>(null)

  function refresh() {
    const iframe = iframeRef.current
    if (!iframe) return

    const currentSrc = iframe.src
    iframe.src = 'about:blank'
    setTimeout(() => {
      iframe.src = currentSrc
    }, 50)
  }

  useImperativeHandle(ref, () => ({
    refresh
  }))

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
            min={400}
            max={1360}
            value={targetVirtualWidth}
            step={10}
            className="range range-xs"
            onChange={(e) => setTargetVirtualWidth(parseInt(e.target.value))}
          />
          <div>
            {targetVirtualWidth}px
          </div>
        </div>
        <div className="tooltip tooltip-left" data-tip="Refresh">
          <FontAwesomeIcon
            icon={faArrowsRotate}
            className="cursor-pointer"
            onClick={refresh}
          />
        </div>
      </div>
      <div
        style={{
          border: '1px solid var(--color-neutral)',
          boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
          overflow: 'auto',
          flex: 1,
          minHeight: 0,
        }}
        ref={previewRef}
      >
        <iframe
          src="/"
          ref={iframeRef}
          style={{
            border: '1px solid var(--color-base-300)',
            width: `${targetVirtualWidth}px`,
            height: `${containerSize.height / previewZoomLevel}px`,
            zoom: previewZoomLevel,
            transformOrigin: 'top left',
          }}
          tabIndex={-1}
          loading="lazy"
        />
      </div>
    </div>
  )
}